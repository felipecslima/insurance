import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UtilsStateService {
  constructor(private http: HttpClient) {
  }

  public objectMap(response: any, key: string): Observable<any> {
    return of(response).pipe(
      map((resp: any) => resp[key] || {}),
    );
  }

  public baseUrl(entity: string) {
    return environment.apiUrl + entity;
  }

  public arrayMap(response: any, entity: string): Observable<any> {
    return of(response).pipe(
      map((resp: any) => resp[entity] || []),
    );
  }

  public objectParams(queryParams: any) {
    let params = new HttpParams();
    Object.keys(queryParams).map(key => {
      if (queryParams[key]) {
        params = params.append(key, queryParams[key]);
      }
    });
    return params;
  }

  public sendMsg(msg: string): Observable<any> {
    return this.http.get('http://192.168.15.18:8080', {
      params: {
        msg,
      },
    }).pipe(take(1));
  }
}
