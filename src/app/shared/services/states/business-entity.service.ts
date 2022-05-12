import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase, EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Business } from '../../interfaces/business.interface';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { RouterParamsService } from '../router-params.service';
import { BusinessDataService } from './business-data.service';
import { UtilsService } from '../utils.service';
import { FormConfigBaseService } from '../../forms/services/form-config-base.service';
import { Person } from '../../interfaces/person.interface';

@Injectable({
  providedIn: 'root'
})
export class BusinessEntityService extends EntityCollectionServiceBase<Business> {

  constructor(
    private businessDataService: BusinessDataService,
    private routerParamsService: RouterParamsService,
    private formConfigBaseService: FormConfigBaseService,
    private utilsService: UtilsService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Businesses', serviceElementsFactory);
  }

  public businessInactive(params: { id: number, personTypeId: number }): Observable<Business> {
    return this.businessDataService.businessInactive(params);
  }

  getParamId(): Observable<string> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.businessId),
      pluck('businessId'),
    );
  }

  public getCurrent(): Observable<Business> {
    return this.getParamId().pipe(
      switchMap(id => this.getEntityById(id)),
    );
  }

  /**
   * Fetch entity by ID from route of the API
   */
  public fetchCurrent(): Observable<Business> {
    return this.getParamId().pipe(
      switchMap(id => this.getByKey(id)),
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
    const {
      businessUser,
      businessAddress,
      businessPhone,
      businessEmail,
    } = business;
    const { id: businessUserId, active: businessUserActive, personTypeId } = businessUser[0];
    const {
      id: addressId,
      zipcode: address_zipcode,
      description: address_description,
      city: address_city,
      number: address_number,
    } = businessAddress[0];
    const { id: phoneId, number: phone_number } = businessPhone[0];
    const { id: emailId, recipient, } = businessEmail[0];

    this.formConfigBaseService.initForm({
      ...business,
      ...businessPhone,
      ...businessEmail,
      id: business.id,
      businessUser: undefined,
      businessAddress: undefined,
      businessPhone: undefined,
      businessEmail: undefined,
      personTypeId,
      businessUserActive,
      phone_number,
      recipient,
      businessUserId,
      emailId,
      addressId,
      phoneId,
      address_zipcode,
      address_description,
      address_city,
      address_number,
    });
  }

  /**
   * Save or update business entity
   * @param values
   */
  save(values: any): Observable<Business> {
    let body: Business = this._defaultSaveEntity(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Business; // personTypeId
    let observable: Observable<Business>;
    if (id) {
      observable = this.update(body);
    } else {
      observable = this.add(body);
    }
    return observable.pipe(
      tap(person => this.upsertOneInCache(person))
    );
  }

  private _defaultSaveEntity(values: any): Business {
    const {
      id,
      name,
      fantasyName,
      document,
      description,
      image,
      active = true,
      // Business user
      businessUserId,
      businessUserActive = true,
      personTypeId,
      // Address data
      addressId,
      address_zipcode,
      address_description,
      address_city,
      address_number,
      // phone data
      phoneId,
      phone_number,
      // email data
      emailId,
      recipient,
    } = values;

    const businessUser = [{
      id: businessUserId,
    }];
    const businessAddress = [{
      id: addressId,
      zipcode: address_zipcode,
      description: address_description,
      city: address_city,
      number: address_number,
    }];
    const businessPhone = [{
      id: phoneId,
      number: phone_number
    }];
    const businessEmail = [{
      id: emailId,
      recipient
    }];
    return {
      id,
      name,
      fantasyName,
      document,
      description,
      image,
      active,
      businessUser,
      businessAddress,
      businessPhone,
      businessEmail,
    };
  }
}
