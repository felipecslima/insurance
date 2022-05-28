import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { Plan } from '../../interfaces/plan.interface';
import { PlansDataService } from './plans-data.service';
import { FormConfigBaseService } from '../../forms/services/form-config-base.service';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class PlansEntityService extends EntityCollectionServiceBase<Plan> {

  static _defaultSaveEntity(values: any): Plan {
    const {
      id,
      name,
      type,
      quantityLife,
      description,
      expirationDay,
      value,
      active = true,
      timestamp,
    } = values;
    return {
      id,
      name,
      type,
      quantityLife: parseInt(quantityLife, 10),
      expirationDay: parseInt(expirationDay, 10),
      description,
      value: (value * 100),
      active,
      timestamp,
    };
  }

  constructor(
    private dataService: PlansDataService,
    private routerParamsService: RouterParamsService,
    private formConfigBaseService: FormConfigBaseService,
    private utilsService: UtilsService,
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

  /**
   * Fetch entity by ID from route of the API
   */
  public fetchCurrent(): Observable<Plan> {
    return this.getParamId().pipe(
      switchMap(id => this.getByKey(id)),
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

  getPlanByType(type: 'E' | 'P'): Observable<Plan[]> {
    return this.entities$.pipe(
      filter(response => !!response),
      map(response => {
        return response.filter(e => e.type === type);
      }),
    );
  }

  populate(entity: Plan) {
    const { value } = entity;
    this.formConfigBaseService.initForm({
      ...entity,
      value: (value / 100),
    });
  }

  /**
   * Save or update business entity
   * @param values
   */
  save(values: any): Observable<Plan> {
    let body: Plan = PlansEntityService._defaultSaveEntity(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Plan;
    let observable: Observable<Plan>;
    if (id) {
      observable = this.update(body);
    } else {
      observable = this.add(body);
    }
    return observable;
  }
}
