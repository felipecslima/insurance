import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { Plan } from '../../interfaces/plan.interface';
import { PlansDataService } from './plans-data.service';
import { Safe } from '../../interfaces/safe.interface';

@Injectable({
  providedIn: 'root'
})
export class PlansEntityService extends EntityCollectionServiceBase<Plan> {

  constructor(
    private dataService: PlansDataService,
    private routerParamsService: RouterParamsService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Plans', serviceElementsFactory);
  }

  public inactive(params: { id: number, personTypeId: number }): Observable<Plan> {
    return this.dataService.inactive(params);
  }

  getParamId(): Observable<string> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.planId),
      pluck('planId'),
    );
  }

  public getCurrent(): Observable<Plan> {
    return this.getParamId().pipe(
      switchMap(id => this.getEntityById(id)),
    );
  }

  getEntityById(id): Observable<Plan> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[id]),
      map(entities => {
        return entities[id];
      }),
    );
  }

  populate(value: Plan) {
    // TODO: Edit populate
  }
}
