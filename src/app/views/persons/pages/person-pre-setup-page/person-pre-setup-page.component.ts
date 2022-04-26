import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { environment } from '../../../../../environments/environment';
import { noop, Unsubscribable } from 'rxjs';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { RoutePartsService } from '../../../../shared/services/route-parts.service';
import { ChildPersonList } from '../../persons.routing';
import { switchMap, take, tap } from 'rxjs/operators';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { PersonFormService } from '../../services/person-form.service';

@Component({
  selector: 'person-pre-setup-page',
  templateUrl: './person-pre-setup-page.component.html',
  styleUrls: ['./person-pre-setup-page.component.scss']
})
@AutoUnsubscribe()
export class PersonPreSetupPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  public formConfig;
  public values: any;
  public isFormValidAutoComplete: boolean;
  public isFormValid: boolean;
  public isFormLoading: boolean;

  private typePerson: ChildPersonList;
  private person: Person;
  public urlSetup: string;

  private permission: Permission;

  constructor(
    private personFormService: PersonFormService,
    private jwtAuthService: JwtAuthService,
    private formFieldService: FormFieldService,
    private formConfigBaseService: FormConfigBaseService,
    private router: Router,
    private route: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private urlService: UrlService,
    private utilsService: UtilsService,
    private personsEntityService: PersonsEntityService) {

    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
      const formValid = this.formConfig ? formConfigBaseService.isAllFormsValid() : true;
      this.checkFormIsValid(formValid);
    });

    routePartsService.generateRouteParts(route.snapshot);

    this.subscribers = route.data
      .pipe(
        take(1),
        tap(data => {
          this.typePerson = data.type;
          this.urlSetup = this.urlService.getUserSetup(null, this.typePerson.type);
          this.permission = this.jwtAuthService.getPermission(this.typePerson.type);
          this.formConfig = this.personFormService.getComplementForm(this.permission);
        }),
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.formConfigBaseService.resetAllForms();
  }

  checkFormIsValid(isValid) {
    this.isFormValid = !!this.isFormValidAutoComplete && !!isValid;
  }


  getCallback(person: Person) {
    this.person = person;
    this.isFormValidAutoComplete = true;
    this.personsEntityService.populate(person);
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }
    this.values = { ...this.values, ...{ personTypeId: this.permission.id, userId: undefined } };
    this.isFormLoading = true;
    this.personsEntityService.save(this.values).subscribe(() => {
      this.utilsService.toast('Usuário salvo com sucesso!', 'success');
      this.router.navigate([this.urlService.getUserList(this.typePerson.type)]);
    }, error => {
      this.isFormLoading = false;
      this.utilsService.setError(error);
    });
  }

  createObject() {

  }
}
