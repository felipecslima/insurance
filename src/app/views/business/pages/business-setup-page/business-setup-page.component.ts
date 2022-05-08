import { Component, OnDestroy, OnInit } from '@angular/core';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, Unsubscribable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { BusinessFormService } from '../../services/business-form.service';
import { BusinessEntityService } from '../../../../shared/services/states/business-entity.service';
import { Business } from '../../../../shared/interfaces/business.interface';

@Component({
  selector: 'business-setup-page',
  templateUrl: './business-setup-page.component.html',
  styleUrls: ['./business-setup-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessSetupPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  typePermission: string;
  permissions: Permission;

  public formConfig;
  public values: any;
  public isFormValid: boolean;
  public isFormLoading: boolean;
  private readonly businessId: number;
  private business: Business;
  person: Person;
  private userId: number;
  private isFormValidAutoComplete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private urlService: UrlService,
    private jwtAuthService: JwtAuthService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private businessFormService: BusinessFormService,
    private businessEntityService: BusinessEntityService,
  ) {
    this.urlService.setBasePath(route);
    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);

    this.subscribers = this.businessEntityService.getServerCurrent().subscribe(noop);

    this.subscribers = route.data
      .pipe(
        take(1),
        switchMap(() => {
          this.setupForm();
          return this.businessEntityService.getCurrent();
        }),
        tap(entity => {
          this.business = entity;
          this.businessEntityService.populate(entity);
        })
      )
      .subscribe(noop);

    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
      this.checkFormIsValid();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  setupForm(): void {
    this.formConfig = this.businessFormService.getDefaultForm(!!this.businessId, this.permissions);
  }

  checkFormIsValid() {
    this.isFormValid = !!this.isFormValidAutoComplete && this.formConfigBaseService.isAllFormsValid();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }
    this.values = { ...this.values, ...{ personTypeId: this.permissions.id }, ...{ businessUserId: this.userId } };
    this.subscribers = this.businessEntityService.save(this.values)
      .subscribe(() => {
        this.utilsService.toast('Clínica salva com sucesso!', 'success');
        this.router.navigate([this.urlService.getBusinessList(this.typePermission)]);
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getCallback(person: Person) {
    this.person = person;
    this.userId = person.user.find(u => u.personTypeId === this.permissions.id)?.id;
    this.isFormValidAutoComplete = true;
    this.checkFormIsValid();
  }
}
