import { Injectable } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { PersonsEntityService } from '../states/persons-entity.service';
import { Permission, Person } from '../../interfaces/person.interface';

@Injectable({
  providedIn: 'root',
})
export class JwtAuthService {
  token;
  isAuthenticated: boolean;
  user: Person = {} as Person;
  user$ = (new BehaviorSubject<Person>(this.user));
  signingIn: boolean;
  return: string;
  JWT_TOKEN = 'JWT_TOKEN';
  APP_USER = 'EGRET_USER';

  permissions: Permission[] = [
    {
      id: 1,
      name: 'coop',
      label: 'Cooperativa',
      paramType: 'cooperativa',
    },
    {
      id: 2,
      name: 'consultant',
      label: 'Consultor',
      paramType: 'consultor',
    },
    {
      id: 3,
      name: 'doctor',
      label: 'Médico',
      paramType: 'medico',
    },
    {
      id: 4,
      name: 'clinic',
      label: 'Clínica',
      paramType: 'clinica',
    },
    {
      id: 5,
      name: 'subscriber',
      label: 'Assinante',
      paramType: 'assinante',
    },
  ];

  constructor(
    private personsEntityService: PersonsEntityService,
    private ls: LocalStoreService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }


  getPermission(paramType: Permission['paramType']): Permission {
    return this.permissions.find(p => p.paramType === paramType);
  }

  getPermissions(paramType: Permission['paramType']): Permission[] {
    return this.permissions;
  }

  public signin(username, password) {
    this.signingIn = true;
    return this.personsEntityService.login(username, password).pipe(
      switchMap((res: any) => {
        this.signingIn = false;
        return this.personsEntityService.self().pipe(
          tap(person => {
            this.setUserAndToken(res.accessToken, person, !!res);
          })
        );
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public checkTokenIsValid() {
    return this.personsEntityService.self()
      .pipe(
        map((profile: Person) => {
          this.setUserAndToken(this.getJwtToken(), profile, true);
          this.signingIn = false;
          return profile;
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }

  public signout() {
    this.setUserAndToken(null, null, false);
    this.router.navigateByUrl('sessions/login');
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return this.ls.getItem(this.JWT_TOKEN);
  }

  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

  setUserAndToken(token: string, person: Person, isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.user = person;
    this.user$.next(person);
    this.ls.setItem(this.JWT_TOKEN, token);
    this.ls.setItem(this.APP_USER, person);
  }
}
