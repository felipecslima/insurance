import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { Business } from '../../interfaces/business.interface';
import { UtilsStateService } from '../utils-state.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessDataService extends DefaultDataService<Business> {
  private entityKey = '/business';
  private _baseUrl = this.uss.baseUrl(this.entityKey);

  constructor(
    private uss: UtilsStateService,
    http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
    super('Business', http, httpUrlGenerator, config);
  }

  businessInactive(params: { id: number, personTypeId: number }): Observable<any> {
    const { id, personTypeId } = params;
    return this.http.put(`${ this._baseUrl }/${ id }/inactive`, { personTypeId });
  }

  getWithQuery(queryParams: QueryParams | string): Observable<Business[]> {
    const params = this.uss.objectParams(queryParams);
    return this.http.get(`${ this._baseUrl }`, { params }).pipe(
      map((response: Business[]) => {
        return response || [];
      })
    );
  }
}
