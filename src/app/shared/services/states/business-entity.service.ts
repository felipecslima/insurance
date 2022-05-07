import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Business } from '../../interfaces/business.interface';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessEntityService extends EntityCollectionServiceBase<Business> {

  constructor(
    private routerParamsService: RouterParamsService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Businesses', serviceElementsFactory);
  }

  public getCurrent(): Observable<Business> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.businessId),
      pluck('businessId'),
      switchMap(id => this.getEntityById(id)),
    );
  }

  getEntityById(id): Observable<Business> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[id]),
      map(entities => {
        return entities[id];
      }),
    );
  }

  populate(business: Business) {

  }
}
