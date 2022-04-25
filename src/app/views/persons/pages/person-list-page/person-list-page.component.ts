import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, of, Unsubscribable } from 'rxjs';
import { PersonListService } from '../../../../shared/services/states/person-list.service';
import { environment } from '../../../../../environments/environment';
import { UtilsService } from '../../../../shared/services/utils.service';
import { UrlService } from '../../../../shared/services/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../../../shared/forms/services/forms.service';
import { ChildPersonList } from '../../persons.routing';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { Person } from '../../../../shared/interfaces/person.interface';
import { ConfirmService } from '../../../../shared/services/app-confirm/confirm.service';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';

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

  constructor(
    private router: Router,
    private jwtAuthService: JwtAuthService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private utilsService: UtilsService,
    private confirmService: ConfirmService,
    public personListService: PersonListService,
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
          const permission = jwtAuthService.getPermission(this.typePerson.type);
          this.paramPersist = {
            personTypeId: permission.id
          };
          this.load(false);
          this._setListColumn();
        }),
        switchMap(data => {
          return this.personListService.getList();
        }),
        tap(persons => {
          const personsFormat = persons.map(person => {
            const { id, username, firstName, lastName } = person;
            const { phone, email, user } = person;
            return {
              id,
              username: this.utilsService.maskCpfCnpj(username),
              name: `${ firstName } ${ lastName }`,
              phone: phone[0]?.number ? this.utilsService.phoneFormat(phone[0].number) : '',
              email: email[0]?.recipient || '',
              user
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
        columnName: 'id',
        displayText: '',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 80,
      },
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
        maxWidth: 150,
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'Email',
        type: 'text',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'edit',
        columnName: 'Editar',
        displayText: 'Editar',
        type: 'button',
        url: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 145,
      },
      {
        id: 'cancel',
        columnName: 'Cancelar',
        displayText: 'Cancelar Conta',
        type: 'button',
        url: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 145,
      },
    ];
  }

  cbButton($event: any) {
    const { element, columnData } = $event;

    if (columnData.id === 'edit') {
      this.router.navigate([this.urlService.getUserSetup(element.id, this.typePerson.type)]);
    } else if (columnData.id === 'cancel') {
      this.confirmCancelAccount(element);
    }
  }

  confirmCancelAccount(person: Person): void {
    this.confirmService.confirm({
      title: 'Deseja realmente cancelar esta conta?',
      message: 'Ao cancelar esta conta não será possível reativala novamente. Você precisará criar um novo cadastro para este usuário. <br/><br/> Deseja continuar ?',
      buttonCancel: {
        show: true,
        label: 'Cancelar Conta'
      },
      buttonConfirm: {
        show: true,
        label: 'Voltar'
      }
    })
      .pipe(
        take(1),
        map((confirm) => {
          const permission = this.jwtAuthService.getPermission(this.typePerson.type);
          const user = person.user.find(user => {
            return user.personTypeId === permission.id;
          });
          return { user, confirm, person };
        }),
        switchMap(response => {
          const { user, confirm, person } = response;
          if (!confirm) {
            return this.personsEntityService.cancelAccount(user.id, person).pipe(
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
