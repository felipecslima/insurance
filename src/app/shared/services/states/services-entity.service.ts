import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { Service } from '../../interfaces/service.interface';
import { ServicesDataService } from './services-data.service';
import { FormConfigBaseService } from '../../forms/services/form-config-base.service';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesEntityService extends EntityCollectionServiceBase<Service> {

  static _defaultSaveEntity(values: any): Service {
    const { id,
      serviceType,
      name,
      description,
      value,
      image,
      active = true,
      timestamp,
    } = values;
    const { id: serviceTypeId } = serviceType;
    return {
      id,
      serviceType,
      serviceTypeId,
      name,
      description,
      value,
      image,
      active,
      timestamp,
    };
  }

  constructor(
    private servicesDataService: ServicesDataService,
    private routerParamsService: RouterParamsService,
    private formConfigBaseService: FormConfigBaseService,
    private utilsService: UtilsService,
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
    this.formConfigBaseService.initForm({
      ...service,
    });
  }

  /**
   * Save or update business entity
   * @param values
   */
  save(values: any): Observable<Service> {
    let body: Service = ServicesEntityService._defaultSaveEntity(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Service; // personTypeId
    let observable: Observable<Service>;
    if (id) {
      observable = this.update(body);
    } else {
      observable = this.add(body);
    }
    return observable;
  }
}
