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
    const {
      id,
      serviceTypeId,
      name,
      description,
      value,
      image,
      active = true,
      timestamp,
    } = values;
    const serviceType = { id: parseInt(serviceTypeId, 10) };
    return {
      id,
      serviceType,
      serviceTypeId,
      name,
      description,
      value: (value * 100),
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

  public inactive(params: { id: number, personTypeId: number, businessId?: number }): Observable<Service> {
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

  /**
   * Fetch entity by ID from route of the API
   */
  public fetchCurrent(): Observable<Service> {
    return this.getParamId().pipe(
      switchMap(id => this.getByKey(id)),
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
    const { serviceType, value } = service;
    const { id: serviceTypeId } = serviceType;
    this.formConfigBaseService.initForm({
      ...service,
      serviceTypeId: serviceTypeId.toString(),
      value: (value / 100),
    });
  }

  populateLink(service: Service, businessId) {
    const { id, value } = service;
    this.formConfigBaseService.initForm({
      businessId,
      id,
      value: (value / 100),
    });
  }

  /**
   * Save or update business entity
   * @param values
   */
  save(values: any): Observable<Service> {
    let body: Service = ServicesEntityService._defaultSaveEntity(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Service;
    let observable: Observable<Service>;
    if (id) {
      observable = this.update(body);
    } else {
      observable = this.add(body);
    }
    return observable;
  }


  /**
   * Save or update business entity
   * @param body
   */
  saveLinkPerson(body: { businessId: number; serviceId: {id: number}[], personDoctorId: number }): Observable<Service> {
    return this.servicesDataService.saveLinkPerson(body);
  }

  /**
   * Save or update business entity
   * @param values
   */
  saveLinkBusiness(values: any): Observable<Service> {
    const { businessId, newValue = 0, value: oldValue = 0, id } = values;
    let value: number;
    const parseNewValue = parseInt(newValue, 10);
    const parseOldValue = parseInt(oldValue, 10);

    if (parseNewValue > 0) {
      value = parseNewValue * 100;
    } else {
      value = parseOldValue;
    }

    const body = {
      businessId,
      serviceId: [
        {
          id,
          value,
        }
      ]
    };
    return this.servicesDataService.linkBusiness(body);
  }
}
