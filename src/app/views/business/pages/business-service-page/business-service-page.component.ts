import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { DateService } from '../../../../shared/services/date.service';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { DialogService } from '../../../../shared/dialogs/dialogs-service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { FormsService } from '../../../../shared/forms/services/forms.service';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { ConfirmService } from '../../../../shared/services/app-confirm/confirm.service';
import { ServicesEntityService } from '../../../../shared/services/states/services-entity.service';
import { ServicesListService } from '../../../../shared/services/states/services-list.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Service } from '../../../../shared/interfaces/service.interface';
import { NumeralService } from '../../../../shared/services/numeral.service';
import { DecoratorFormValues, GetFormValues } from '../../../../shared/decorators/get-form-values.decorator';
import { BusinessServiceFormService } from '../../services/business-service-form.service';

@Component({
  selector: 'business-service-page',
  templateUrl: './business-service-page.component.html',
  styleUrls: ['./business-service-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessServicePageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  dataSource;
  columns: TableInfinityListColumn[];

  urlSetup: string;
  paramPersist;

  value: Service[];
  person: Person;

  typePermission: string;
  permissions: Permission;

  @GetFormValues()
  formValues: DecoratorFormValues;

  constructor(
    private numeralService: NumeralService,
    private businessServiceFormService: BusinessServiceFormService,
    private servicesEntityService: ServicesEntityService,
    private dateService: DateService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private dialogService: DialogService,
    private router: Router,
    private jwtAuthService: JwtAuthService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private utilsService: UtilsService,
    private confirmService: ConfirmService,
    public servicesListService: ServicesListService,
  ) {
    servicesListService.resetList();
    formsService.resetForm();
    this.urlService.setBasePath(route);
    this.subscribers = this.formValues.subscription;

    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);

    this.person = this.jwtAuthService.getUser();
    this.subscribers = this.route.queryParams
      .pipe(
        switchMap(queryParams => {
          this.paramPersist = {};
          const { serviceTypeId, name } = queryParams;
          if (serviceTypeId) {
            this.paramPersist['serviceTypeId'] = serviceTypeId;
          }
          if (name) {
            this.paramPersist['name'] = name;
          }
          servicesListService.resetList();
          this.urlSetup = this.urlService.getBusinessServiceSetup();
          this.load(false);
          this._setListColumn();
          return this.servicesListService.getList();
        }),
        tap(value => {
          this.servicesListService.setDataTable(
            this.getListColumnValues(value)
          );
        })
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  load(isLoadMore = true) { // LOAD MORE
    this.servicesListService.load(isLoadMore, this.paramPersist);
  }

  openFilter() {
    this.formConfigBaseService.initForm(this.paramPersist);
    this.dialogService.open('REGULAR', 'FilterListComponent', this.businessServiceFormService.getFilterForm());
  }

  cbButton($event: any) {

    const { element, columnData } = $event;
    if (columnData.id === 'edit') {
      this.router.navigate([this.urlService.getBusinessServiceSetup(element.id)]);
    } else if (columnData.id === 'cancel') {
      if (element.active) {
        this.confirmInactive(element);
      }
    }
  }

  confirmInactive(value: Service): void {
    const user = this.person.user.find(p => p.personTypeId === this.permissions.id);
    const msg = 'Ao inativar este servi??o todas as clinicas vinculadas a ele tamb??m perder??o acesso a este servi??o. <br/><br/> Deseja continuar ?';
    this.confirmService.confirm({
      title: `Deseja realmente inativar este servi??o?`,
      message: msg,
      buttonCancel: {
        show: true,
        label: 'Voltar'
      },
      buttonConfirm: {
        show: true,
        label: `Inativar servi??o`
      }
    })
      .pipe(
        take(1),
        map((confirm) => {
          return { confirm };
        }),
        switchMap(response => {
          const { confirm } = response;
          if (confirm) {
            return this.servicesEntityService.inactive({
              id: value.id,
              personTypeId: user.personTypeId
            }).pipe(
              map(() => {
                return { error: false };
              })
            );
          }
          return of({ error: true });
        })
      )
      .subscribe((error) => {
        if (error) {
          return;
        }
        this.utilsService.toast('Servi??o inativado!', 'success');
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getListColumnValues(values: Service[]) {
    return values.map(val => {
      const { id, value, active, serviceType, description, name } = val;
      return {
        id,
        serviceTypeName: serviceType.name,
        name,
        description,
        value: this.numeralService.formatMoney(value),
        status: active ? 'Ativo' : 'Inativo',
        active
      };
    });
  }

  private _setListColumn() {
    this.columns = [
      {
        id: 'id',
        columnName: 'serviceTypeName',
        displayText: 'Tipo',
        type: 'text',
        urlBase: this.urlService.getBusinessServiceSetup()
      },
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Servi??o',
        type: 'text',
        urlBase: this.urlService.getBusinessServiceSetup()
      },
      {
        id: 'id',
        columnName: 'description',
        displayText: 'Descri????o',
        type: 'text',
        urlBase: this.urlService.getBusinessServiceSetup()
      },
      {
        id: 'id',
        columnName: 'value',
        displayText: 'Valor',
        type: 'text',
        urlBase: this.urlService.getBusinessServiceSetup()
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        buttonLabel: 'Editar',
        type: 'button',
        url: this.urlService.getBusinessServiceSetup(),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'status',
        displayText: 'Status',
        type: 'button',
        url: this.urlService.getBusinessServiceSetup(),
        maxWidth: 145,
      },
    ];
  }

}
