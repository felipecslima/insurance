import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { Business } from '../../../../shared/interfaces/business.interface';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { DecoratorFormValues, GetFormValues } from '../../../../shared/decorators/get-form-values.decorator';
import { NumeralService } from '../../../../shared/services/numeral.service';
import { BusinessPlainFormService } from '../../services/business-plain-form.service';
import { PlansEntityService } from '../../../../shared/services/states/plans-entity.service';
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
import { PlansListService } from '../../../../shared/services/states/plans-list.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Safe } from '../../../../shared/interfaces/safe.interface';
import { BusinessSafeFormService } from '../../services/business-safe-form.service';
import { SafesEntityService } from '../../../../shared/services/states/safes-entity.service';
import { SafesListService } from '../../../../shared/services/states/safes-list.service';

@Component({
  selector: 'business-safe-page',
  templateUrl: './business-safe-page.component.html',
  styleUrls: ['./business-safe-page.component.scss']
})
export class BusinessSafePageComponent implements OnInit, OnDestroy {
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
    private businessSafeFormService: BusinessSafeFormService,
    private safesEntityService: SafesEntityService,
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
    public safesListService: SafesListService,
  ) {
    safesListService.resetList();
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
          const { name, } = queryParams;
          if (name) {
            this.paramPersist['name'] = name;
          }
          safesListService.resetList();
          this.urlSetup = this.urlService.getBusinessSafeSetup();
          this.load(false);
          this._setListColumn();
          return this.safesListService.getList();
        }),
        tap(response => {
          this.safesListService.setDataTable(
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
    this.safesListService.load(isLoadMore, this.paramPersist);
  }

  openFilter() {
    this.formConfigBaseService.initForm(this.paramPersist);
    this.dialogService.open('REGULAR', 'FilterListComponent', this.businessSafeFormService.getFilterForm());
  }

  cbButton($event: any) {
    const { element, columnData } = $event;
    if (columnData.id === 'edit') {
      this.router.navigate([this.urlService.getBusinessSafeSetup(element.id)]);
    } else if (columnData.id === 'cancel') {
      if (element.active) {
        this.confirmInactive(element);
      }
    }
  }

  confirmInactive(value: Safe): void {
    const user = this.person.user.find(p => p.personTypeId === this.permissions.id);
    const msg = 'Ao inativar este seguro todas as clinicas vinculadas a ele também perderão acesso a este seguro. <br/><br/> Deseja continuar ?';
    this.confirmService.confirm({
      title: `Deseja realmente inativar este seguro?`,
      message: msg,
      buttonCancel: {
        show: true,
        label: 'Voltar'
      },
      buttonConfirm: {
        show: true,
        label: `Inativar seguro`
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
            return this.safesEntityService.inactive({
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
        this.utilsService.toast('Seguro inativado!', 'success');
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getListColumnValues(values: Safe[]) {
    return values.map(val => {
      const { id, active, name,  value, description } = val;
      return {
        id,
        name,
        value: this.numeralService.formatMoney(value),
        description,
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
        displayText: 'Seguro',
        type: 'text',
        urlBase: this.urlService.getBusinessSafeSetup()
      },
      {
        id: 'id',
        columnName: 'value',
        displayText: 'Valor',
        type: 'text',
        urlBase: this.urlService.getBusinessSafeSetup()
      },
      {
        id: 'id',
        columnName: 'description',
        displayText: 'Descrição',
        type: 'text',
        urlBase: this.urlService.getBusinessSafeSetup()
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        buttonLabel: 'Editar',
        type: 'button',
        url: this.urlService.getBusinessSafeSetup(),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'status',
        displayText: 'Status',
        type: 'button',
        url: this.urlService.getBusinessSafeSetup(),
        maxWidth: 145,
      },
    ];
  }

}
