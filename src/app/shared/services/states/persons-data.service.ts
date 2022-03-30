import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilsStateService } from '../utils-state.service';
import { Person } from '../../interfaces/person.interface';

@Injectable({ providedIn: 'root' })
export class PersonsDataService extends DefaultDataService<Person> {
  private entityKey = '/persons';
  private _baseUrl = this.uss.baseUrl(this.entityKey);

  constructor(
    private uss: UtilsStateService,
    http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
    super('Persons', http, httpUrlGenerator, config);
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    console.log(`${ this._baseUrl }/login`)
    return this.http.post(`${ this._baseUrl }/login`, body);
  }
}