import { Injectable } from '@angular/core';
import { PersonsEntityService } from './persons-entity.service';
import { Person } from '../../interfaces/person.interface';
import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TableEntityService } from './table-entity.service';

@Injectable({ providedIn: 'root' })
export class PersonListService {

  /**
   * The first search
   */
  isFirstResult = true;

  /**
   * The first result for the wallet search query
   */
  firstResult = 0;

  /**
   * The maximum results expected from the wallet search query
   */
  maxResults = 20;

  /**
   * Flag variable for LOADING state
   */
  isLoading: boolean;

  /**
   * Flag variable for the disable load action
   */
  disableLoad: boolean;

  /**
   * Flag variable for the empty result
   */
  emptyResult = false;

  /**
   * Flag variable for empty search result
   */
  emptySearch = false;

  /**
   * Array with all the fields to search in the query string
   */
  filterArray = [
    'q',
  ];

  list: Person[] = [];

  constructor(
    private tableEntityService: TableEntityService,
    private personsEntityService: PersonsEntityService,
  ) {
  }

  /**
   * Reset list including table state
   */
  resetList(): void {
    this.isFirstResult = true;
    this.isLoading = false;
    this.disableLoad = false;
    this.emptyResult = false;
    this.emptySearch = false;
    this.firstResult = 0;
    this.tableEntityService.clearCache();
    this.personsEntityService.clearCache();
  }

  setDataTable(data: any) {
    this.tableEntityService.upsertManyInCache(data);
  }

  /**
   * Get array list
   */
  getList(): Observable<Person[]> {
    return this.personsEntityService.entities$;
  }

  isLoadMore(isLoadMore): void {
    if (isLoadMore) {
      this.emptyResult = false;
      this.emptySearch = false;
      this.firstResult = this.maxResults + this.firstResult;
    } else {
      this.isFirstResult = false;
    }
  }

  load(isLoadMore?: boolean, params?: any): void {
    this.isLoadMore(isLoadMore);
    if (this.disableLoad || this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.personsEntityService.getWithQuery({
      firstResult: this.firstResult.toString(),
      maxResults: this.maxResults.toString(),
      ...params,
    })
      .pipe(take(1), finalize(() => this.isLoading = false))
      .subscribe(response => {
        if (response.length < this.maxResults) {
          this.disableLoad = true;
        }

        if (response.length > 0) {
          this.emptyResult = false;
        }

        if (response.length === 0 && this.list.length === 0) {
          if (this.hasFilterInParams(params)) {
            this.emptySearch = true;
          } else {
            this.emptyResult = true;
          }
        }
        if (this.list && this.list.length) {
          this.list = this.list.concat(this.list);
        }
      });
  }

  /**
   * Checks if it has any filter in params to return the correct empty state ('search' or 'no records')
   * @private
   */
  private hasFilterInParams(params: any = {}) {
    let hasFilter = false;
    const excludeKeys = [
      'firstResult',
      'maxResults',
    ];
    this.filterArray.map(key => {
      if (!excludeKeys.includes(key) && params[key]) {
        hasFilter = true;
      }
    });
    return hasFilter;
  }


}
