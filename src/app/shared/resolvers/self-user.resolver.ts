import { delay, map, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PersonsEntityService } from '../services/states/persons-entity.service';
import { JwtAuthService } from '../services/auth/jwt-auth.service';
import { Person } from '../interfaces/person.interface';

@Injectable()
export class UserSelfResolver implements Resolve<Person> {
  constructor(
    private personEntityService: PersonsEntityService,
    private router: Router,
    private jwtAuthService: JwtAuthService,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    return this.personEntityService.self().pipe(
      delay(300),
      tap(response => {
        console.log('set self');
        this.jwtAuthService.setUser(response);
      })
    );
  }
}
