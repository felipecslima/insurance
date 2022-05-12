import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { Plain } from '../../interfaces/plain.interface';
import { PlainsDataService } from './plains-data.service';
import { Safe } from '../../interfaces/safe.interface';

@Injectable({
  providedIn: 'root'
})
export class PlainsEntityService extends EntityCollectionServiceBase<Plain> {

  constructor(
    private dataService: PlainsDataService,
    private routerParamsService: RouterParamsService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Plains', serviceElementsFactory);
  }

  public inactive(params: { id: number, personTypeId: number }): Observable<Plain> {
    return this.dataService.inactive(params);
  }

  getParamId(): Observable<string> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.plainId),
      pluck('plainId'),
    );
  }

  public getCurrent(): Observable<Plain> {
    return this.getParamId().pipe(
      switchMap(id => this.getEntityById(id)),
    );
  }

  getEntityById(id): Observable<Plain> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[id]),
      map(entities => {
        return entities[id];
      }),
    );
  }

  populate(value: Plain) {
    // TODO: Edit populate
  }
}
