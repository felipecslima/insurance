import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { Business, BusinessEmail, BusinessPhone } from '../../../../shared/interfaces/business.interface';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { BusinessFormService } from '../../services/business-form.service';
import { BusinessEntityService } from '../../../../shared/services/states/business-entity.service';
import { DateService } from '../../../../shared/services/date.service';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { DialogService } from '../../../../shared/dialogs/dialogs-service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { FormsService } from '../../../../shared/forms/services/forms.service';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { BusinessListService } from '../../../../shared/services/states/business-list.service';
import { switchMap, tap } from 'rxjs/operators';
import { LayoutService } from '../../../../shared/services/layout.service';
import { BusinessSelectedService } from '../../business-selected.service';

@Component({
  selector: 'business-list-page',
  templateUrl: './business-list-page.component.html',
  styleUrls: ['./business-list-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessListPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  dataSource;
  columns: TableInfinityListColumn[];

  baseUrl: string;
  paramPersist;

  business: Business[];
  person: Person;

  typePermission: string;
  permissions: Permission;

  constructor(
    private businessSelectedService: BusinessSelectedService,
    private layoutService: LayoutService,
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
    public businessListService: BusinessListService
  ) {
    businessListService.resetList();
    formsService.resetForm();
    this.urlService.setBasePath(route);

    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);

    this.person = this.jwtAuthService.getUser();
    this.baseUrl = this.urlService.getUserList('medico');
    this.subscribers = this.route.queryParams
      .pipe(
        switchMap(queryParams => {
          this.paramPersist = {};
          const {
            document,
            fantasyName,
            phone,
            businessUserName
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
    this.layoutService.publishLayoutChange({
      sidebarStyle: 'closed',
    });
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
        type: 'click',
      },
      {
        id: 'id',
        columnName: 'fantasyName',
        displayText: 'Nome Fantasia',
        type: 'click',
      },
      {
        id: 'id',
        columnName: 'cnpj',
        displayText: 'CNPJ',
        type: 'click',
        maxWidth: 250,
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'E-mail',
        type: 'click',
        minWidth: 250,
      },
      {
        id: 'id',
        columnName: 'phone',
        displayText: 'Telefone',
        type: 'click',
        maxWidth: 250,
      }
    ];
  }

  cbButton($event: any) {
    this.businessSelectedService.set($event.element);
    this.router.navigate([this.baseUrl]);
  }
}
