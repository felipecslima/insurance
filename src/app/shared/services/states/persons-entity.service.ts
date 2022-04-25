import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory, MergeStrategy } from '@ngrx/data';
import { Login, Person } from '../../interfaces/person.interface';
import { Observable } from 'rxjs';
import { PersonsDataService } from './persons-data.service';
import { RouterParamsService } from '../router-params.service';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { UtilsService } from '../utils.service';
import { DateService } from '../date.service';
import { FormConfigBaseService } from '../../forms/services/form-config-base.service';

@Injectable({ providedIn: 'root' })
export class PersonsEntityService extends EntityCollectionServiceBase<Person> {

  constructor(
    private formConfigBaseService: FormConfigBaseService,
    private dateService: DateService,
    private utilsService: UtilsService,
    private routerParamsService: RouterParamsService,
    private personsDataService: PersonsDataService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Persons', serviceElementsFactory);
  }

  public userInactive(idUser: number, person: Person): Observable<Person> {
    return this.personsDataService.userInactive(idUser).pipe(
      tap(() => {
        this.removeOneFromCache(person);
      })
    );
  }

  public cancelAccount(): Observable<Person> {
    return this.personsDataService.cancelAccount();
  }

  public forgotPassword(email: string, birthday: string) {
    return this.personsDataService.forgotPassword(email, birthday);
  }

  public changePassword(password: string, passwordConfirm: string, token: string) {
    return this.personsDataService.changePassword(password, passwordConfirm, token);
  }

  public login(username: string, password: string): Observable<Login> {
    return this.personsDataService.login(username, password);
  }

  public self(): Observable<Person> {
    return this.personsDataService.self().pipe(
      map(response => {
        const person: any = response.person;
        person.permission = response.permission;
        return person;
      })
    );
  }

  public selfState(): Observable<Person> {
    return this.personsDataService.self().pipe(
      map(response => {
        const person: any = response.person;
        person.permission = response.permission;
        this.upsertOneInCache(person);
        return person;
      })
    );
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

  /**
   * Get the current selected business by the user, based on the
   * router service param attribute 'businessId'
   */
  public getServerCurrent(): Observable<Person> {
    return this.routerParamsService.params.pipe(
      filter(params => !!params?.personId),
      pluck('personId'),
      switchMap(id => this.getByKey(id)),
    );
  }

  getEntityById(id): Observable<Person> {
    return this.entityMap$.pipe(
      filter(entities => entities && !!entities[id]),
      map(entities => {
        return entities[id];
      }),
    );
  }

  save(values: unknown): Observable<Person> {
    let body = this._defaultSavePerson(values);
    body = this.utilsService.removeEmpty(body);
    const { id } = values as Person; // personTypeId
    let observable: Observable<Person>;
    if (id) {
      observable = this.personsDataService.edit(body);
    } else {
      observable = this.personsDataService.save(body);
    }
    return observable.pipe(
      tap(person => this.upsertOneInCache(person))
    );
  }

  public populate(person: Person) {
    const { user, address, email, phone } = person;
    const { recipient, id: emailId } = email[0];
    let { birthday } = person;
    birthday = this.dateService.getDateFormatted(birthday, 'YYYY-MM-DD', 'DD/MM/YYYY');
    const { number: addressNumber, id: addressId } = address[0];
    const { id: userId } = user[0];
    let { number: phoneNumber } = phone[0];
    const { id: phoneId } = phone[0];
    phoneNumber = this.utilsService.phoneFormat(phoneNumber);
    this.formConfigBaseService.initForm({
      ...person,
      birthday,
      ...user,
      ...address[0],
      id: person.id,
      emailId,
      addressId,
      userId,
      phoneId,
      addressNumber,
      recipient,
      phoneNumber,
    });
  }

  private _defaultSavePerson(values) {
    const {
      id,
      firstName, lastName, birthday, document, username, personTypeId,
      password, zipcode,
      description,
      city,
      addressNumber,
      phoneNumber, recipient, emailId,
      addressId,
      userId,
      phoneId
    } = values;
    const person = {
      id, firstName, lastName, birthday, document,
      username: this.utilsService.removeCPFMask(username)
    };
    const user = {
      id: userId,
      personTypeId,
      password
    };
    const address = [
      {
        id: addressId,
        zipcode,
        description,
        city,
        number: addressNumber
      }
    ];
    const phone = [{
      id: phoneId,
      number: phoneNumber,
    }];
    const email = [{
      id: emailId,
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
