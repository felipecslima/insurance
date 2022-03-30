import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableInfinityListColumn } from '../../../../shared/components/table-list/table-list.component';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { Unsubscribable } from 'rxjs';
import { PersonListService } from '../../../../shared/services/states/person-list.service';

@Component({
  selector: 'person-list-page',
  templateUrl: './person-list-page.component.html',
  styleUrls: ['./person-list-page.component.scss']
})
@AutoUnsubscribe()
export class PersonListPageComponent implements OnInit, OnDestroy {
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  dataSource;
  columns: TableInfinityListColumn[];

  constructor(
    private personListService: PersonListService,
  ) {
    this.personListService.load();

    this.subscribers = this.personListService.getList()
      .subscribe(persons => {
        this.personListService.setDataTable(persons);
      });

    this.columns = [
      {
        id: 'id',
        columnName: 'id',
        displayText: '',
        urlBase: '/usuario/editar/',
        maxWidth: 80,
      },
      {
        id: 'id',
        columnName: 'name',
        displayText: 'Nome',
        urlBase: '/usuario/editar/'
      }
    ];


  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  load() { // LOAD MORE
    console.log('oi')
    this.personListService.load(true);
  }

}
