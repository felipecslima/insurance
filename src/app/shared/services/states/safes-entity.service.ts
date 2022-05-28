import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { SafesDataService } from './safes-data.service';
import { Safe } from '../../interfaces/safe.interface';
import { Service } from '../../interfaces/service.interface';
import { UtilsService } from '../utils.service';
import { FormConfigBaseService } from '../../forms/services/form-config-base.service';

@Injectable({
  providedIn: 'root'
})
export class SafesEntityService extends EntityCollectionServiceBase<Safe> {

  static _defaultSaveEntity(values: any): Safe {
    const {
      id,
      name,
      value,
      description,
      active = true,
      timestamp
    } = values;

    return {
      id,
      name,
      description,
      value: (value * 100),
      active,
      timestamp,
    };
  }

  constructor(
    private dataService: SafesDataService,
    private routerParamsService: RouterParamsService,
    private utilsService: UtilsService,
    private formConfigBaseService: FormConfigBaseService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Safes', serviceElementsFactory);
  }

  public inactive(params: { id: number, personTypeId: number }): Observable<Safe> {
    return this.dataService.inactive(params);
  }

  getParamId(): Observable<string> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.safeId),
      pluck('safeId'),
    );
  }

  public getCurrent(): Observable<Safe> {
    return this.getParamId().pipe(
      switchMap(id => this.getEntityById(id)),
    );
  }

  /**
   * Fetch entity by ID from route of the API
   */
  public fetchCurrent(): Observable<Service> {
    return this.getParamId().pipe(
      switchMap(id => this.getByKey(id)),
    );
  }

  getEntityById(id): Observable<Safe> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[id]),
      map(entities => {
        return entities[id];
      }),
    );
  }

  getSafesActive(): Observable<Safe[]> {
    return this.entities$.pipe(
      filter(entities => entities && entities.length > 0),
      map(entities => {
        return entities.filter(e => e.active === true);
      }),
    );
  }

  populate(entity: Safe) {
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
  save(values: any): Observable<Safe> {
    let body: Safe = SafesEntityService._defaultSaveEntity(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Service;
    let observable: Observable<Safe>;
    if (id) {
      observable = this.update(body);
    } else {
      observable = this.add(body);
    }
    return observable;
  }
}
