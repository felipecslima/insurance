import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Person } from '../../interfaces/person.interface';

@Injectable({ providedIn: 'root' })
export class PersonsEntityService extends EntityCollectionServiceBase<Person> {

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Persons', serviceElementsFactory);
  }

}
