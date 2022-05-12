import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { Service } from '../../interfaces/service.interface';
import { ServicesDataService } from './services-data.service';
import { Plain } from '../../interfaces/plain.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesEntityService extends EntityCollectionServiceBase<Service> {

  constructor(
    private servicesDataService: ServicesDataService,
    private routerParamsService: RouterParamsService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Services', serviceElementsFactory);
  }

  public inactive(params: { id: number, personTypeId: number }): Observable<Service> {
    return this.servicesDataService.inactive(params);
  }

  getParamId(): Observable<string> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.serviceId),
      pluck('serviceId'),
    );
  }

  public getCurrent(): Observable<Service> {
    return this.getParamId().pipe(
      switchMap(id => this.getEntityById(id)),
    );
  }


  getEntityById(id): Observable<Service> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[id]),
      map(entities => {
        return entities[id];
      }),
    );
  }

  populate(service: Service) {
    // TODO: Edit populate
  }
}
