import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { Business } from '../../../../shared/interfaces/business.interface';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { DecoratorFormValues, GetFormValues } from '../../../../shared/decorators/get-form-values.decorator';
import { NumeralService } from '../../../../shared/services/numeral.service';
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
import { map, switchMap, take, tap } from 'rxjs/operators';
import { PlansListService } from '../../../../shared/services/states/plans-list.service';
import { Plan } from '../../../../shared/interfaces/plan.interface';
import { PlansEntityService } from '../../../../shared/services/states/plans-entity.service';
import { BusinessPlanFormService } from '../../services/business-plan-form.service';

@Component({
  selector: 'business-plan-page',
  templateUrl: './business-plan-page.component.html',
  styleUrls: ['./business-plan-page.component.scss']
})
export class BusinessPlanPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  dataSource;
  columns: TableInfinityListColumn[];

  urlSetup: string;
  paramPersist;

  business: Business[];
  person: Person;

  typePermission: string;
  permissions: Permission;

  @GetFormValues()
  formValues: DecoratorFormValues;

  constructor(
    private numeralService: NumeralService,
    private businessPlainFormService: BusinessPlanFormService,
    private plainsEntityService: PlansEntityService,
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
    public plainsListService: PlansListService,
  ) {
    plainsListService.resetList();
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
          const { name, type } = queryParams;
          if (name) {
            this.paramPersist['name'] = name;
          }
          if (type) {
            this.paramPersist['type'] = type;
          }
          plainsListService.resetList();
          this.urlSetup = this.urlService.getBusinessPlainSetup();
          this.load(false);
          this._setListColumn();
          return this.plainsListService.getList();
        }),
        tap(response => {
          this.plainsListService.setDataTable(
            this.getListColumnValues(response)
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
    this.plainsListService.load(isLoadMore, this.paramPersist);
  }

  openFilter() {
    this.formConfigBaseService.initForm(this.paramPersist);
    this.dialogService.open('REGULAR', 'FilterListComponent', this.businessPlainFormService.getFilterForm());
  }

  cbButton($event: any) {
    const { element, columnData } = $event;
    if (columnData.id === 'edit') {
      this.router.navigate([this.urlService.getBusinessPlainSetup(element.id)]);
    } else if (columnData.id === 'cancel') {
      if (element.active) {
        this.confirmInactive(element);
      }
    }
  }

  confirmInactive(value: Plan): void {
    const user = this.person.user.find(p => p.personTypeId === this.permissions.id);
    const msg = 'Ao inativar este serviço todas as clinicas vinculadas a ele também perderão acesso a este serviço. <br/><br/> Deseja continuar ?';
    this.confirmService.confirm({
      title: `Deseja realmente inativar este plano?`,
      message: msg,
      buttonCancel: {
        show: true,
        label: 'Voltar'
      },
      buttonConfirm: {
        show: true,
        label: `Inativar plano`
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
            return this.plainsEntityService.inactive({
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
        this.utilsService.toast('Plano inativado!', 'success');
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getListColumnValues(values: Plan[]) {
    return values.map(val => {
      const { id, active, name, quantityLife, value, expirationDay, type } = val;
      return {
        id,
        name,
        quantityLife,
        value: this.numeralService.formatMoney(value),
        expirationDay: `Dia ${ expirationDay }`,
        type: type === 'E' ? 'Empresarial' : 'Pessoal',
        status: active ? 'Ativo' : 'Inativo',
        active
      };
    });
  }

  private _setListColumn() {

    this.columns = [
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Plano',
        type: 'text',
        urlBase: this.urlService.getBusinessPlainSetup()
      },
      {
        id: 'id',
        columnName: 'quantityLife',
        displayText: 'Qtd de vidas',
        type: 'text',
        urlBase: this.urlService.getBusinessPlainSetup()
      },
      {
        id: 'id',
        columnName: 'value',
        displayText: 'Valor',
        type: 'text',
        urlBase: this.urlService.getBusinessPlainSetup()
      },
      {
        id: 'id',
        columnName: 'type',
        displayText: 'Tipo ',
        type: 'text',
        urlBase: this.urlService.getBusinessPlainSetup()
      },
      {
        id: 'id',
        columnName: 'expirationDay',
        displayText: 'Vencimento ',
        type: 'text',
        urlBase: this.urlService.getBusinessPlainSetup()
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        buttonLabel: 'Editar',
        type: 'button',
        url: this.urlService.getBusinessPlainSetup(),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'status',
        displayText: 'Status',
        type: 'button',
        url: this.urlService.getBusinessPlainSetup(),
        maxWidth: 145,
      },
    ];
  }

}
