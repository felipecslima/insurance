import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { UtilsStateService } from '../utils-state.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesDataService extends DefaultDataService<Service> {
  private entityKey = '/services';
  private _baseUrl = this.uss.baseUrl(this.entityKey);

  constructor(
    private uss: UtilsStateService,
    http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config: DefaultDataServiceConfig) {
    super('Services', http, httpUrlGenerator, config);
  }

  add(entity: Service): Observable<Service> {
    return this.http.post(`${ this._baseUrl }`, entity).pipe(
      map(response => {
        return response as Service;
      })
    );
  }

  inactive(params: { id: number, personTypeId: number, businessId?: number; }): Observable<any> {
    const { id, personTypeId, businessId } = params;
    return this.http.put(`${ this._baseUrl }/${ id }/inactive`, { personTypeId, businessId });
  }

  getWithQuery(queryParams: QueryParams | string): Observable<Service[]> {
    const params = this.uss.objectParams(queryParams);
    return this.http.get(`${ this._baseUrl }`, { params }).pipe(
      map((response: Service[]) => {
        return response || [];
      })
    );
  }

  linkBusiness(body: { businessId: number; serviceId: {id: number, value: number}[] }): Observable<any> {
    return this.http.post(`${ this._baseUrl }/business`, body).pipe(
      map(response => {
        return response as Service;
      })
    );
  }
  saveLinkPerson(body: { businessId: number; serviceId: {id: number}[], personDoctorId: number }): Observable<any> {
    return this.http.post(`${ this._baseUrl }/doctor`, body).pipe(
      map(response => {
        return response as Service;
      })
    );
  }
}
