import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, Observable, Unsubscribable } from 'rxjs';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { RoutePartsService } from '../../../../shared/services/route-parts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { Person } from '../../../../shared/interfaces/person.interface';
import { UtilsService } from '../../../../shared/services/utils.service';
import { DateService } from '../../../../shared/services/date.service';
import { ChildPersonList } from '../../persons.routing';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { PersonFormService } from '../../services/person-form.service';
import { UrlService } from '../../../../shared/services/url.service';

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
  private readonly personId: number;
  private typePerson: ChildPersonList;

  constructor(
    private router: Router,
    private urlService: UrlService,
    private personFormService: PersonFormService,
    private jwtAuthService: JwtAuthService,
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
    this.personId = personId;

    this.subscribers = route.data
      .pipe(
        take(1),
        switchMap((data) => {
          this.typePerson = data.type;
          this.setupForm();
          return personsEntityService.getCurrent();
        }),
        tap(person => {
          this.person = person;
          this._populate();

        })
      )
      .subscribe(noop);

    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
      this.isFormValid = formConfigBaseService.isAllFormsValid();
    });

    this.subscribers = this.personsEntityService.getByKey(this.personId).subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  private _populate() {
    const { user, address, email, phone } = this.person;
    const { recipient, id: emailId } = email[0];
    let { birthday } = this.person;
    birthday = this.dateService.getDateFormatted(birthday, 'YYYY-MM-DD', 'DD/MM/YYYY');
    const { number: addressNumber, id: addressId } = address[0];
    const { id: userId } = user[0];
    let { number: phoneNumber } = phone[0];
    const { id: phoneId } = phone[0];
    phoneNumber = this.utilsService.phoneFormat(phoneNumber);
    this.formConfigBaseService.initForm({
      ...this.person,
      birthday,
      ...user,
      ...address[0],
      id: this.personId,
      emailId,
      addressId,
      userId,
      phoneId,
      addressNumber,
      recipient,
      phoneNumber,
    });
  }

  setupForm(): void {
    this.formConfig = this.personFormService.getDefaultForm(!!this.personId);
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }
    const personTypeId = this.jwtAuthService.getPermission(this.typePerson.type);
    this.values = { ...this.values, ...{ personTypeId: personTypeId.id } };
    this.personsEntityService.save(this.values)
      .subscribe(() => {
        this.utilsService.toast('Usuário salvo com sucesso!', 'success');
        this.router.navigate([this.urlService.getUserList(this.typePerson.type)]);
      }, error => {
        this.utilsService.setError(error);
      });
  }

}
