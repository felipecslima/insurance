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
import { BusinessServiceFormService } from '../../services/business-service-form.service';
import { ServicesEntityService } from '../../../../shared/services/states/services-entity.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { BusinessSelectedService } from '../../business-selected.service';

@Component({
  selector: 'business-service-link-setup-page',
  templateUrl: './business-service-link-setup-page.component.html',
  styleUrls: ['./business-service-link-setup-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessServiceLinkSetupPageComponent  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
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
    private businessSelectedService: BusinessSelectedService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private urlService: UrlService,
    private jwtAuthService: JwtAuthService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private entityFormService: BusinessServiceFormService,
    private entityService: ServicesEntityService,
  ) {
    this.urlService.setBasePath(route);
    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);

    this.subscribers = this.entityService.fetchCurrent().subscribe(noop);

    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
      this.checkFormIsValid();
    });

    this.subscribers = this.businessSelectedService.get().pipe(
      tap(business => {
        this.formConfigBaseService.setValue({businessId: business.id});
      })
    ).subscribe(noop);
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
          return this.entityService.getCurrent().pipe(
            switchMap((service) => {
              return this.businessSelectedService.get().pipe(
                map(business => {
                  return {
                    business,
                    service,
                  };
                })
              );
            })
          );
        }),
        tap(response => {
          const  {
            business,
            service,
          } = response;
          this.setProgress(false);
          this.entity = service;
          this.entityService.populateLink(service, business.id);
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
    this.formConfig = this.entityFormService.getLinkForm();
  }

  checkFormIsValid() {
    this.isFormValid = !!this.formConfigBaseService.isAllFormsValid();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }
    this.subscribers = this.entityService.saveLinkBusiness(this.values)
      .subscribe(() => {
        this.utilsService.toast('Serviço salvo com sucesso!', 'success');
        this.router.navigate([this.urlService.getBusinessServiceLink(this.typePermission)]);
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getService($event: Service) {
    this.entity = $event;
    this.formConfigBaseService.setValue($event);
  }
}
