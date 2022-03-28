import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Login, Person } from '../../interfaces/person.interface';
import { Observable } from 'rxjs';
import { PersonsDataService } from './persons-data.service';

@Injectable({ providedIn: 'root' })
export class PersonsEntityService extends EntityCollectionServiceBase<Person> {

  constructor(
    private personsDataService: PersonsDataService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Persons', serviceElementsFactory);
  }

  public login(username: string, password: string): Observable<Login> {
    return this.personsDataService.login(username, password);
  }

  public self(): Observable<Person> {
    return this.getByKey('self');
  }

}
