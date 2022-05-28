import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { PersonsListService } from '../../../../shared/services/states/persons-list.service';
import { environment } from '../../../../../environments/environment';
import { UtilsService } from '../../../../shared/services/utils.service';
import { UrlService } from '../../../../shared/services/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../../../shared/forms/services/forms.service';
import { ChildPersonList } from '../../persons.routing';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { ConfirmService } from '../../../../shared/services/app-confirm/confirm.service';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { DialogService } from '../../../../shared/dialogs/dialogs-service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { DateService } from '../../../../shared/services/date.service';
import { PersonFormService } from '../../services/person-form.service';

@Component({
  selector: 'person-list-page',
  templateUrl: './person-list-page.component.html',
  styleUrls: ['./person-list-page.component.scss']
})
@AutoUnsubscribe()
export class PersonListPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  dataSource;
  columns: TableInfinityListColumn[];

  urlSetup: string;
  typePerson: ChildPersonList;

  paramPersist;

  public permission: Permission;

  persons: Person[];

  constructor(
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
    private personFormService: PersonFormService,
    public personListService: PersonsListService,
    private personsEntityService: PersonsEntityService
  ) {
    personListService.resetList();
    formsService.resetForm();
    this.urlService.setBasePath(route);

    this.subscribers = route.data
      .pipe(
        tap(data => {
          this.typePerson = data.type;
          this.urlSetup = this.urlService.getUserPreSetup(this.typePerson.type);
          this.permission = jwtAuthService.getPermission(this.typePerson.type);
        }),
        mergeMap(() => {
          return this.route.queryParams;
        }),
        switchMap(queryParams => {
          personListService.resetList();
          const { username, phone } = queryParams;
          this.paramPersist = {
            ...queryParams,
            personTypeId: this.permission.id,
          };

          if (username) {
            this.paramPersist['username'] = utilsService.removeCPFMask(username);
          }
          if (phone) {
            this.paramPersist['phone'] = utilsService.removeMaskPhone(phone);
          }

          if (this.permission.id === 3) { // doctor
            this._setListColumnDoctor();
          } else {
            this._setListColumn();
          }


          this.load(false);
          return this.personListService.getList();
        }),
        tap(persons => {
          this.persons = persons;
          const personsFormat = persons.map(person => {
            const { id, username, firstName, lastName, doctor, birthday, address } = person;
            const { phone, email, user } = person;
            const userBy = user.find(u => u.personTypeId === this.permission.id);
            const { skill, medicalId } = doctor[0] || [] as any;
            const { city } = address[0];
            return {
              id,
              username: this.utilsService.maskCpfCnpj(username),
              name: `${ firstName } ${ lastName }`,
              phone: phone[0]?.number ? this.utilsService.phoneFormat(phone[0].number) : '',
              email: email[0]?.recipient || '',
              user,
              skill,
              medicalId,
              birthday: this.dateService.format(birthday, 'DD/MM/YYYY'),
              city,
              status: userBy.active ? 'Ativo' : 'Inativo',
            };
          });
          this.personListService.setDataTable(personsFormat);
        })
      )
      .subscribe(noop);

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  load(isLoadMore = true) { // LOAD MORE
    this.personListService.load(isLoadMore, this.paramPersist);
  }

  private _setListColumn() {
    this.columns = [
      {
        id: 'id',
        columnName: 'username',
        displayText: 'CPF',
        type: 'text',
        maxWidth: 150,
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Nome',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'phone',
        displayText: 'Telefone',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 250,
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'E-mail',
        type: 'text',
        minWidth: 250,
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        buttonLabel: 'Editar',
        type: 'button',
        url: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'status',
        displayText: 'Status',
        type: 'button',
        url: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 145,
      },
    ];
  }

  private _setListColumnDoctor() {
    this.columns = [
      {
        id: 'id',
        columnName: 'username',
        displayText: 'CPF',
        type: 'text',
        maxWidth: 150,
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Nome',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'skill',
        displayText: 'Especialidade',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'E-mail',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'birthday',
        displayText: 'Data de Nascimento',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'phone',
        displayText: 'Telefone',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 150,
      },
      {
        id: 'id',
        columnName: 'city',
        displayText: 'Cidade',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type),
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        buttonLabel: 'Editar',
        type: 'button',
        url: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'status',
        displayText: 'Status',
        type: 'button',
        url: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 145,
      },
    ];
  }

  openFilter() {
    this.formConfigBaseService.initForm(this.paramPersist);
    this.dialogService.open('REGULAR', 'FilterListComponent', this.personFormService.getFilterForm(this.permission));
  }

  cbButton($event: any) {
    const { element, columnData } = $event;
    if (columnData.id === 'edit') {
      this.router.navigate([this.urlService.getUserSetup(element.id, this.typePerson.type)]);
    } else if (columnData.id === 'cancel') {
      const user = this.getUser(element);
      if (user.active) {
        this.confirmCancelAccount(element);
      }
    }
  }

  getUser(element) {
    const person = this.persons.find(p => p.id === element.id);
    const permission = this.jwtAuthService.getPermission(this.typePerson.type);
    return person.user.find(user => {
      return user.personTypeId === permission.id;
    });
  }

  confirmCancelAccount(element: Person): void {
    const person = this.persons.find(p => p.id === element.id);
    const permission = this.jwtAuthService.getPermission(this.typePerson.type);
    const user = person.user.find(user => {
      return user.personTypeId === permission.id;
    });
    const status = user.active ? 'inativar' : 'ativar';
    let msg = 'Ao inativar esta conta o usuário não terá mais acesso ao sistema. <br/><br/> Deseja continuar ?';
    if (!user.active) {
      msg = 'Ao ativar esta conta o usuário restaurará o seu acesso ao sistema. <br/><br/> Deseja continuar ?';
    }
    this.confirmService.confirm({
      title: `Deseja realmente ${ status } esta conta?`,
      message: msg,
      buttonCancel: {
        show: true,
        label: 'Voltar'
      },
      buttonConfirm: {
        show: true,
        label: `${ user.active ? 'Inativar' : 'Ativar' } conta`
      }
    })
      .pipe(
        take(1),
        map((confirm) => {
          return { user, confirm };
        }),
        switchMap(response => {
          const { user, confirm } = response;
          if (confirm) {
            return this.personsEntityService.userInactive({ id: user.id, personTypeId: user.personTypeId }).pipe(
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
        this.utilsService.toast('Cliente cancelado', 'success');
      }, error => {
        this.utilsService.setError(error);
      });
  }
}
