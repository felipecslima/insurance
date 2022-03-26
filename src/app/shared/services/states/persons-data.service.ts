import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilsStateService } from '../utils-state.service';
import { Person } from '../../interfaces/person.interface';

@Injectable({ providedIn: 'root' })
export class PersonsDataService extends DefaultDataService<Person> {
  private entityKey = 'persons';
  private entityKeySingular = 'person';
  private _baseUrl = this.uss.baseUrl(this.entityKey);

  constructor(
    private uss: UtilsStateService,
    http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
    super('Person', http, httpUrlGenerator, config);
  }

  update(update: any): Observable<Person> {
    const body: any = {};
    body[this.entityKeySingular] = update.changes;
    return this.http.put(`${this._baseUrl}/${update.id}`, body).pipe(
      switchMap(response => this.uss.objectMap(response, this.entityKeySingular)),
    );
  }

  add(add: Person): Observable<Person> {
    const body: any = {};
    body[this.entityKeySingular] = add;
    return this.http.post(this._baseUrl, body).pipe(
      switchMap(response => this.uss.objectMap(response, this.entityKeySingular)),
    );
  }

  getAll(): Observable<Person[]> {
    return this.http.get(this._baseUrl).pipe(
      switchMap(response => this.uss.arrayMap(response, this.entityKey)),
    );
  }

  getWithQuery(queryParams: QueryParams | string): Observable<Person[]> {
    const params = this.uss.objectParams(queryParams);
    return this.http.get(this._baseUrl, { params }).pipe(
      switchMap(response => this.uss.arrayMap(response, this.entityKey)),
    );
  }

}
