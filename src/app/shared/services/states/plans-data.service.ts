import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { UtilsStateService } from '../utils-state.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plan } from '../../interfaces/plan.interface';

@Injectable({
  providedIn: 'root'
})
export class PlansDataService extends DefaultDataService<Plan> {
  private entityKey = '/plans';
  private _baseUrl = this.uss.baseUrl(this.entityKey);

  constructor(
    private uss: UtilsStateService,
    http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
    super('Plans', http, httpUrlGenerator, config);
  }

  add(entity: Plan): Observable<Plan> {
    return this.http.post(`${ this._baseUrl }`, entity).pipe(
      map(response => {
        return response as Plan;
      })
    );
  }

  inactive(params: { id: number, personTypeId: number }): Observable<any> {
    const { id, personTypeId } = params;
    return this.http.put(`${ this._baseUrl }/${ id }/inactive`, { personTypeId });
  }

  getWithQuery(queryParams: QueryParams | string): Observable<Plan[]> {
    const params = this.uss.objectParams(queryParams);
    return this.http.get(`${ this._baseUrl }`, { params }).pipe(
      map((response: Plan[]) => {
        return response || [];
      })
    );
  }
}
