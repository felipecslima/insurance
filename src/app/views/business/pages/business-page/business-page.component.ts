import { Component, OnDestroy, OnInit } from '@angular/core';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
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
import { BusinessListService } from '../../../../shared/services/states/business-list.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Business, BusinessEmail, BusinessPhone } from '../../../../shared/interfaces/business.interface';
import { BusinessEntityService } from '../../../../shared/services/states/business-entity.service';
import { BusinessFormService } from '../../services/business-form.service';

@Component({
  selector: 'business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessPageComponent implements OnInit, OnDestroy {
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

  constructor(
    private businessFormService: BusinessFormService,
    private businessEntityService: BusinessEntityService,
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
    public businessListService: BusinessListService,
  ) {
    businessListService.resetList();
    formsService.resetForm();
    this.urlService.setBasePath(route);

    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);

    this.person = this.jwtAuthService.getUser();
    this.urlSetup = this.urlService.getBusinessSetup();
    this.subscribers = this.route.queryParams
      .pipe(
        switchMap(queryParams => {
          this.paramPersist = {};
          const {
            document,
            fantasyName,
            phone,
            businessUserName,
          } = queryParams;

          if (document) {
            this.paramPersist['document'] = this.utilsService.removeMask(document);
          }
          if (phone) {
            this.paramPersist['phone'] = this.utilsService.removeMask(phone);
          }
          if (fantasyName) {
            this.paramPersist['fantasyName'] = fantasyName;
          }
          if (businessUserName) {
            this.paramPersist['businessUserName'] = businessUserName;
          }

          businessListService.resetList();
          this.load(false);
          this._setListColumn();
          this.load(false);
          return this.businessListService.getList();
        }),
        tap(business => {
          this.businessListService.setDataTable(
            this.getListColumnValues(business)
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
    this.businessListService.load(isLoadMore, this.paramPersist);
  }

  openFilter() {
    this.formConfigBaseService.initForm(this.paramPersist);
    this.dialogService.open('REGULAR', 'FilterListComponent', this.businessFormService.getFilterForm());
  }

  cbButton($event: any) {
    const { element, columnData } = $event;
    if (columnData.id === 'edit') {
      this.router.navigate([this.urlService.getBusinessSetup(element.id)]);
    } else if (columnData.id === 'cancel') {
      if (element.active) {
        this.confirmCancelAccount(element);
      }
    }
  }

  confirmCancelAccount(business: Person): void {
    const user = this.person.user.find(p => p.personTypeId === this.permissions.id);
    const msg = 'Ao inativar esta clínica a mesma não terá mais acesso ao sistema. <br/><br/> Deseja continuar ?';
    this.confirmService.confirm({
      title: `Deseja realmente inativar esta clínica?`,
      message: msg,
      buttonCancel: {
        show: true,
        label: 'Voltar'
      },
      buttonConfirm: {
        show: true,
        label: `Inativar clínica`
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
            return this.businessEntityService.businessInactive({
              id: business.id,
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
        this.utilsService.toast('Clínica inativada!', 'success');
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getListColumnValues(values: Business[]) {
    return values.map(value => {
      const { id, name, fantasyName, document, businessEmail, businessPhone, businessUser, active } = value;
      const cnpj = this.utilsService.maskCpfCnpj(document);
      const [bEmail = {}] = businessEmail;
      const { recipient: email } = bEmail as BusinessEmail;
      const [bPhone = {}] = businessPhone || [];
      const { number } = bPhone as BusinessPhone;

      const [bUser] = businessUser;

      const { person } = bUser;
      const { name: userFullName, username } = person;
      const user = `${ this.utilsService.maskCpfCnpj(username) } - ${ userFullName }`;
      return {
        id,
        name,
        fantasyName,
        cnpj,
        email,
        phone: number ? this.utilsService.maskPhone(number) : undefined,
        user,
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
        displayText: 'Razão Social',
        type: 'text',
        urlBase: this.urlService.getBusinessSetup()
      },
      {
        id: 'id',
        columnName: 'fantasyName',
        displayText: 'Nome Fantasia',
        type: 'text',
        urlBase: this.urlService.getBusinessSetup(),
      },
      {
        id: 'id',
        columnName: 'cnpj',
        displayText: 'CNPJ',
        type: 'text',
        maxWidth: 250,
        urlBase: this.urlService.getBusinessSetup()
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'E-mail',
        type: 'text',
        minWidth: 250,
        urlBase: this.urlService.getBusinessSetup()
      },
      {
        id: 'id',
        columnName: 'phone',
        displayText: 'Telefone',
        type: 'text',
        maxWidth: 250,
        urlBase: this.urlService.getBusinessSetup()
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        buttonLabel: 'Editar',
        type: 'button',
        url: this.urlService.getBusinessSetup(),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'status',
        displayText: 'Status',
        type: 'button',
        url: this.urlService.getBusinessSetup(),
        maxWidth: 145,
      },
    ];
  }
}
