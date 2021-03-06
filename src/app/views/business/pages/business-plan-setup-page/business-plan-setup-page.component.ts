import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, Unsubscribable } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { environment } from '../../../../../environments/environment';
import { Permission } from '../../../../shared/interfaces/person.interface';
import { Service } from '../../../../shared/interfaces/service.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../shared/services/utils.service';
import { UrlService } from '../../../../shared/services/url.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { BusinessPlanFormService } from '../../services/business-plan-form.service';
import { PlansEntityService } from '../../../../shared/services/states/plans-entity.service';

@Component({
  selector: 'business-plan-setup-page',
  templateUrl: './business-plan-setup-page.component.html',
  styleUrls: ['./business-plan-setup-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessPlanSetupPageComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked  {
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  @ViewChild('progress') progressBar: MatProgressBar;

  colors = environment.color;

  typePermission: string;
  permissions: Permission;

  public entityId: number;
  public formConfig;
  public values: any;
  public isFormValid: boolean;
  public isFormLoading: boolean;
  private entity: Service;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private urlService: UrlService,
    private jwtAuthService: JwtAuthService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private entityFormService: BusinessPlanFormService,
    private entityService: PlansEntityService,
  ) {
    this.urlService.setBasePath(route);
    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);

    this.subscribers = this.entityService.fetchCurrent().subscribe(noop);

    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
      this.checkFormIsValid();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.subscribers = this.route.data
      .pipe(
        take(1),
        switchMap(() => {
          this.setupForm();
          return this.entityService.getParamId();
        }),
        switchMap((entityId) => {
          if (entityId) {
            this.entityId = parseInt(entityId, 10);
            this.setProgress(true);
          }
          this.setupForm();
          return this.entityService.getCurrent();
        }),
        tap(entity => {
          this.setProgress(false);
          this.entity = entity;
          this.entityService.populate(entity);
        })
      )
      .subscribe(noop, () => {
        this.setProgress(false);
      });
  }

  setProgress(status: boolean): void {
    if (this.progressBar) {
      this.progressBar.mode = status ? 'indeterminate' : 'determinate';
    }
  }

  setupForm(): void {
    this.formConfig = this.entityFormService.getDefaultForm(!!this.entityId, this.permissions);
  }

  checkFormIsValid() {
    this.isFormValid = !!this.formConfigBaseService.isAllFormsValid();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }
    const values = { ...this.values, };
    this.subscribers = this.entityService.save(values)
      .subscribe(() => {
        this.utilsService.toast('Servi??o salvo com sucesso!', 'success');
        this.back();
      }, error => {
        this.utilsService.setError(error);
      });
  }

  back() {
    this.router.navigate([this.urlService.getBusinessPlanList(this.typePermission)]);
  }
}
