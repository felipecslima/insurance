import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, Unsubscribable } from 'rxjs';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { RoutePartsService } from '../../../../shared/services/route-parts.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { Person } from '../../../../shared/interfaces/person.interface';
import { UtilsService } from '../../../../shared/services/utils.service';
import { DateService } from '../../../../shared/services/date.service';

@Component({
  selector: 'person-setup-page',
  templateUrl: './person-setup-page.component.html',
  styleUrls: ['./person-setup-page.component.scss']
})
@AutoUnsubscribe()
export class PersonSetupPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  person: Person;

  public formConfig;
  public values: any;
  public isFormValid: boolean;
  public isFormLoading: boolean;


  constructor(
    private dateService: DateService,
    private utilsService: UtilsService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private route: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private personsEntityService: PersonsEntityService,
  ) {
    routePartsService.generateRouteParts(route.snapshot);

    const { personId } = routePartsService.params;

    this.subscribers = this.personsEntityService.getByKey(personId).subscribe(noop);
    this.subscribers = personsEntityService.getCurrent()
      .pipe(take(1))
      .subscribe(response => {
        this.person = response;
        this.setupForm();
        this._populate();
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  private _populate() {
    const { user, address, email, phone } = this.person;
    let { birthday } = this.person;
    birthday = this.dateService.getDateFormatted(birthday, 'YYYY-MM-DD', 'DD/MM/YYYY');
    const { number: addressNumber } = address;
    let { number: phoneNumber } = phone;
    phoneNumber = this.utilsService.phoneFormat(phoneNumber);
    this.formConfigBaseService.initForm({
      ...this.person,
      birthday,
      ...user,
      ...address,
      addressNumber,
      ...email,
      phoneNumber,
    });
  }

  setupForm(): void {
    const fieldAddressDescription = this.formFieldService.getText({
      name: 'description',
      title: 'Endereço:',
      placeholder: 'Digite seu endereço',
      validations: ['required'],
    });
    const fieldAddressNumber = this.formFieldService.getText({
      name: 'addressNumber',
      title: 'Número:',
      placeholder: 'Digite o número',
      validations: ['required'],
    });

    this.formConfig = [
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome:',
        placeholder: 'Digite seu nome',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'recipient',
        title: 'Email:',
        placeholder: 'Digite seu e-mail',
        validations: ['required', 'email'],
      }),
      this.formFieldService.getText({
        name: 'phoneNumber',
        title: 'Telefone:',
        placeholder: 'Digite seu telefone ou celular',
        mask: 'PHONE',
        validations: ['required', 'phone'],
      }),
      this.formFieldService.getText({
        name: 'birthday',
        title: 'Data de nascimento:',
        placeholder: 'Digite sua data de nascimento',
        mask: 'DATE',
        validations: ['required', 'date'],
      }),
      this.formFieldService.getText({
        name: 'username',
        title: 'CPF:',
        placeholder: 'Digite seu CPF',
        mask: 'CPF',
        validations: ['required', 'cpf'],
      }),
      this.formFieldService.getText({
        name: 'document',
        title: 'RG:',
        placeholder: 'Digite seu RG',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'zipcode',
        placeholder: 'Digite seu CEP',
        title: 'CEP:',
        mask: 'CEP',
        validations: ['required'],
      }),
      {
        group: [
          {
            align: {
              flex: 80,
            },
            ...fieldAddressDescription
          },
          {
            align: {
              flex: 20,
            },
            ...fieldAddressNumber
          }
        ]
      },
      this.formFieldService.getText({
        name: 'city',
        title: 'Cidade:',
        placeholder: 'Digite sua cidade',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'password',
        inputType: 'password',
        title: 'Senha:',
        minValue: 8,
        validations: ['required', 'minValue'],
      }),
    ];

  }

}
