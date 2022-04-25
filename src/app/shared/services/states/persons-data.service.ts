import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { UtilsStateService } from '../utils-state.service';
import { Person, PersonCrud } from '../../interfaces/person.interface';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PersonsDataService extends DefaultDataService<Person> {
  private entityKey = '/persons';
  private _baseUrl = this.uss.baseUrl(this.entityKey);

  constructor(
    private uss: UtilsStateService,
    http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
    super('Persons', http, httpUrlGenerator, config);
  }

  userInactive(id: number): Observable<any> {
    return this.http.put(`${ this._baseUrl }/${ id }/inactive`, {});
  }

  cancelAccount(): Observable<any> {
    return this.http.post(`${ this._baseUrl }/cancel`, {});
  }

  forgotPassword(email: string, birthday: string): Observable<any> {
    const body = { email, birthday };
    return this.http.post(`${ this._baseUrl }/forgetpassword/`, body);
  }


  changePassword(password: string, passwordConfirm: string, token: string): Observable<any> {
    const body = { password, passwordConfirm };
    return this.http.put(`${ this._baseUrl }/forgetpassword/?t=${ token }`, body);
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${ this._baseUrl }/login`, body);
  }

  save(body: PersonCrud): Observable<Person> {
    return this.http.post(`${ this._baseUrl }`, body).pipe(
      map(response => {
        return response as Person;
      })
    );
  }

  edit(body: PersonCrud): Observable<Person> {
    return this.http.put(`${ this._baseUrl }/${ body.id }`, body).pipe(
      map(response => {
        return response as Person;
      })
    );
  }

  self(): Observable<any> {
    return this.http.get(`${ this._baseUrl }/self`);
  }

  getWithQuery(queryParams: QueryParams | string): Observable<Person[]> {
    const params = this.uss.objectParams(queryParams);
    return this.http.get(`${ this._baseUrl }`, { params }).pipe(
      map((response: Person[]) => {
        return response || [];
      })
    );
  }
}
