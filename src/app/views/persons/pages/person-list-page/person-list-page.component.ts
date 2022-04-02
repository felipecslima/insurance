import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { Unsubscribable } from 'rxjs';
import { PersonListService } from '../../../../shared/services/states/person-list.service';
import { environment } from '../../../../../environments/environment';
import { Person } from '../../../../shared/interfaces/person.interface';
import { UtilsService } from '../../../../shared/services/utils.service';

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

  constructor(
    private utilsService: UtilsService,
    private personListService: PersonListService,
  ) {
    this.personListService.load();

    this.subscribers = this.personListService.getList()
      .subscribe((persons: Person[]) => {
       const personsFormat = persons.map(person => {
          const { id, username, name, phone, email } = person;
          return {
            id,
            username: this.utilsService.maskCpfCnpj(username),
            name,
            phone: phone?.number ? this.utilsService.phoneFormat(phone.number) : '',
            email: email?.recipient || '',
          };
        });
        this.personListService.setDataTable(personsFormat);
      });

    this.columns = [
      {
        id: 'id',
        columnName: 'id',
        displayText: '',
        urlBase: '/usuario/setup/',
        maxWidth: 80,
      },
      {
        id: 'id',
        columnName: 'username',
        displayText: 'CPF',
        urlBase: '/usuario/setup/'
      },
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Nome',
        urlBase: '/usuario/setup/'
      },
      {
        id: 'id',
        columnName: 'phone',
        displayText: 'Telefone',
        urlBase: '/usuario/setup/'
      },
      {
        id: 'id',
        columnName: 'email',
        displayText: 'Email',
        urlBase: '/usuario/setup/'
      },

    ];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  load() { // LOAD MORE
    this.personListService.load(true);
  }

}
