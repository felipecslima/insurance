import { Component, OnDestroy, OnInit } from '@angular/core';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { Permission } from '../../../../shared/interfaces/person.interface';
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

  constructor(
    private route: ActivatedRoute,
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
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  setupForm(): void {
    this.formConfig = this.businessFormService.getDefaultForm(!!this.businessId, this.permissions);
  }

  save(): void {
    // TODO: Business save/update
    // if (!this.isFormValid) {
    //   return;
    // }
    // this.values = { ...this.values, ...{ personTypeId: this.permission.id } };
    // this.personsEntityService.save(this.values)
    //   .subscribe(() => {
    //     this.utilsService.toast('Usuário salvo com sucesso!', 'success');
    //     this.router.navigate([this.urlService.getUserList(this.typePerson.type)]);
    //   }, error => {
    //     this.utilsService.setError(error);
    //   });
  }

}
