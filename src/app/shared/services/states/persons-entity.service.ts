import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Login, Person } from '../../interfaces/person.interface';
import { Observable } from 'rxjs';
import { PersonsDataService } from './persons-data.service';
import { RouterParamsService } from '../router-params.service';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { UtilsService } from '../utils.service';

@Injectable({ providedIn: 'root' })
export class PersonsEntityService extends EntityCollectionServiceBase<Person> {


  constructor(
    private utilsService: UtilsService,
    private routerParamsService: RouterParamsService,
    private personsDataService: PersonsDataService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Persons', serviceElementsFactory);
  }

  public login(username: string, password: string): Observable<Login> {
    return this.personsDataService.login(username, password);
  }

  public self(): Observable<Person> {
    return this.personsDataService.self();
  }

  /**
   * Get the current selected business by the user, based on the
   * router service param attribute 'businessId'
   */
  public getCurrent(): Observable<Person> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.personId),
      pluck('personId'),
      switchMap(id => this.getEntityById(id)),
    );
  }

  getEntityById(businessId): Observable<Person> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[businessId]),
      map(entities => {
        return entities[businessId];
      }),
    );
  }

  save(values: unknown): Observable<Person> {
    let body = this._defaultSavePerson(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Person; // personTypeId
    if (id) {
      return this.update(body);
    }
    return this.add(body);
  }

  private _defaultSavePerson(values) {
    const {
      id,
      name, birthday, document, username, personTypeId,
      password, zipcode,
      description,
      city,
      addressNumber,
      phoneNumber, recipient
    } = values;
    const person = {
      id, name, birthday, document, username
    };
    const user = [{
      personTypeId, password
    }];
    const address = [
      {
        zipcode,
        description,
        city,
        number: addressNumber
      }
    ];
    const phone = [{
      number: phoneNumber,
    }];
    const email = [{
      recipient
    }];
    return {
      ...person,
      user,
      address,
      phone,
      email,
    };
  }
}
