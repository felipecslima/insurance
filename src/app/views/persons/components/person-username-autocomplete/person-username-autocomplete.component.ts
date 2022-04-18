import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { noop, Observable, Unsubscribable } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { MatOptionSelectionChange } from '@angular/material/core';
import { UrlService } from '../../../../shared/services/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChildPersonList } from '../../persons.routing';
import { UtilsService } from '../../../../shared/services/utils.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';

@Component({
  selector: 'Òperson-username-autocomplete',
  templateUrl: './person-username-autocomplete.component.html',
  styleUrls: ['./person-username-autocomplete.component.scss']
})
@AutoUnsubscribe()
export class PersonUsernameAutocompleteComponent implements OnInit, OnDestroy {
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  @Output() callback: EventEmitter<Person> = new EventEmitter<Person>();

  usernameControl = new FormControl(null, [Validators.required]);
  public mask = [/[1-9]/, /\d/, /\d/, '.', /[1-9]/, /\d/, /\d/, '.', /[1-9]/, /\d/, /\d/, '-', /[1-9]/, /\d/];

  options: Person[] = [];
  filteredOptions: Observable<Person[] | any>;
  hasFind: boolean;
  urlSetup: string;
  typePerson: ChildPersonList;
  personPermission: Permission;

  constructor(
    private router: Router,
    private confirmService: AppConfirmService,
    private jwtAuthService: JwtAuthService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private personsEntityService: PersonsEntityService) {
    this.urlService.setBasePath(route);
    this.subscribers = route.data
      .pipe(
        tap(data => {
          this.typePerson = data.type;
          this.urlSetup = this.urlService.getUserSetup(null, this.typePerson.type);
          this.personPermission = jwtAuthService.getPermission(this.typePerson.type);
          this.filteredOptions = this.usernameControl.valueChanges.pipe(
            startWith(''),
            filter(value => {
              return value?.length > 0;
            }),
            switchMap(value => {
              return this.personsEntityService.getWithQuery({}
              ).pipe(
                catchError(e => {
                  this.hasFind = true;
                  return e;
                }),
              );
            }),
            map((value: Person[]) => {
              this.hasFind = true;
              this.options = value;
              return value;
            }),
          );
        })
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onSelection($event: MatOptionSelectionChange) {
    const person: Person = $event.source.value;
    const personExistsInTypeId = !!person.user.find(pu => {
      return pu.personTypeId === this.personPermission.id;
    });

    if (personExistsInTypeId) {
      const confirmService = this.confirmService.confirm({
        title: 'Pessoa já cadastrada para essa função',
        message: `
          Você não pode cadastrar duas vezes a mesma pessoa para esta função no sistema<br/> <br/>
          Caso não tenha encontrado a pessoa que deseja tente <br/>
          cadastrala clicando no <strong>botão verde</strong>
          `,
        buttonCancel: {
          label: 'Ok, Entendi!',
          show: true
        },
        buttonConfirm: {
          label: 'Cadastrar uma nova pessoa',
          show: true
        }
      });

      this.subscribers = confirmService.subscribe(data => {
        if (data) {
          this.router.navigate([this.urlSetup]);
        }
      });
      return;
    }
    this.callback.emit(person);
  }

  displayFn(person: Person): string {
    if (!person) {
      return '';
    }
    const { username, firstName, lastName } = person;
    return `${ username } - ${ firstName } ${ lastName }`;
  }
}
