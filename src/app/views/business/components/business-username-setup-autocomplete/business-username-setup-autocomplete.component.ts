import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { Observable, Unsubscribable } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap } from 'rxjs/operators';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { Person } from '../../../../shared/interfaces/person.interface';
import { MatOptionSelectionChange } from '@angular/material/core';
import { UrlService } from '../../../../shared/services/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../shared/services/utils.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ConfirmService } from '../../../../shared/services/app-confirm/confirm.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ValidatorCpf } from '../../../../shared/forms/validators/validator-cpf';

@Component({
  selector: 'business-username-setup-autocomplete',
  templateUrl: './business-username-setup-autocomplete.component.html',
  styleUrls: ['./business-username-setup-autocomplete.component.scss']
})
@AutoUnsubscribe()
export class BusinessUsernameSetupAutocompleteComponent implements OnInit, OnDestroy {
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  @Input() username: string;
  @Output() callback: EventEmitter<Person> = new EventEmitter<Person>();

  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  usernameControl = new FormControl(null, [ValidatorCpf.validator]);
  public mask = [/[1-9]/, /\d/, /\d/, '.', /[1-9]/, /\d/, /\d/, '.', /[1-9]/, /\d/, /\d/, '-', /[1-9]/, /\d/];

  options: Person[] = [];
  filteredOptions: Observable<Person[] | any>;
  hasFind: boolean;
  urlSetup: string;

  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;

  constructor(
    private router: Router,
    private confirmService: ConfirmService,
    private jwtAuthService: JwtAuthService,
    public utilsService: UtilsService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private personsEntityService: PersonsEntityService) {
    this.urlService.setBasePath(route);

    this.filteredOptions = this.usernameControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(response => {
        if (typeof response !== 'string') {
          return response.username;
        }
        return response ? response?.trim() : '';
      }),
      filter(value => {
        return (typeof value === 'string' && !(value?.indexOf(' | ') > -1));
      }),
      map(username => this.utilsService.removeCPFMask(username)),
      filter(value => {
        return value?.length > 0 && this.utilsService.verifyCpf(value);
      }),
      switchMap(username => {
        this.progressBar.mode = 'indeterminate';
        return this.personsEntityService.getWithQuery({
            username,
            personTypeId: '4'
          }
        );
      }),
      map((value: Person[]) => {
        this.hasFind = true;
        this.options = value;
        this.progressBar.mode = 'determinate';
        setTimeout(() => {
          const [person] = value || [];
          if (person) {
            const options = this._auto.autocomplete.options.toArray();
            this.usernameControl.setValue(options[0].value, { emitEvent: false });
            this.onSelection(null, { person });
          }
        }, 10);
        return value;
      }));

    this.progressBar.mode = 'determinate';
  }

  ngOnInit(): void {
    this.usernameControl.setValue(this.username || '');
  }

  ngOnDestroy(): void {
  }

  onSelection($event: MatOptionSelectionChange, preSelect?) {
    const { person } = $event?.source?.value || preSelect;
    this.callback.emit(person);
  }

  displayFn(response): string {
    const { person, maskCpf } = response || {};
    if (!person) {
      return '';
    }
    const { username, firstName, lastName } = person || {};
    return `${ maskCpf(username) } | ${ firstName } ${ lastName }`;
  }
}
