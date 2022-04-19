import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, Unsubscribable } from 'rxjs';
import { PersonListService } from '../../../../shared/services/states/person-list.service';
import { environment } from '../../../../../environments/environment';
import { UtilsService } from '../../../../shared/services/utils.service';
import { UrlService } from '../../../../shared/services/url.service';
import { ActivatedRoute } from '@angular/router';
import { FormsService } from '../../../../shared/forms/services/forms.service';
import { ChildPersonList } from '../../persons.routing';
import { switchMap, tap } from 'rxjs/operators';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';

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
    private jwtAuthService: JwtAuthService,
    private formsService: FormsService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private utilsService: UtilsService,
    private personListService: PersonListService,
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
            const { phone, email } = person;
            return {
              id,
              username: this.utilsService.maskCpfCnpj(username),
              name: `${ firstName } ${ lastName }`,
              phone: phone[0]?.number ? this.utilsService.phoneFormat(phone[0].number) : '',
              email: email[0]?.recipient || '',
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
    this.personListService.resetList();
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
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type),
        maxWidth: 80,
      },
      {
        id: 'id',
        columnName: 'username',
        displayText: 'CPF',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Nome',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'phone',
        displayText: 'Telefone',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'Email',
        urlBase: this.urlService.getUserSetup(null, this.typePerson.type)
      },
    ];
  }

}
