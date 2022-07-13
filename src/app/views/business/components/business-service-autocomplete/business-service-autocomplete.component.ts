import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { Observable, Unsubscribable } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../../../shared/services/app-confirm/confirm.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { UrlService } from '../../../../shared/services/url.service';
import { debounceTime, filter, map, startWith, switchMap } from 'rxjs/operators';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Service } from '../../../../shared/interfaces/service.interface';
import { ServicesEntityService } from '../../../../shared/services/states/services-entity.service';

@Component({
  selector: 'business-service-autocomplete',
  templateUrl: './business-service-autocomplete.component.html',
  styleUrls: ['./business-service-autocomplete.component.scss']
})
@AutoUnsubscribe()
export class BusinessServiceAutocompleteComponent implements OnInit, OnDestroy, OnChanges {
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  @Input() serviceId: number;
  @Input() businessId: number;
  @Output() callback: EventEmitter<Service> = new EventEmitter<Service>();

  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  inputControl = new FormControl(null);

  options: Service[] = [];
  filteredOptions: Observable<Service[] | any>;
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
    private servicesEntityService: ServicesEntityService) {
    this.urlService.setBasePath(route);
  }

  ngOnInit(): void {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(response => {
        if (typeof response !== 'string') {
          return response.id;
        }
        return response ? response?.trim() : '';
      }),
      filter(value => {
        return (typeof value === 'string' && value.length > 0) || !!this.serviceId;
      }),
      switchMap(name => {
        this.setProgress('indeterminate');
        if (this.serviceId) {
          return this.servicesEntityService.getByKey(this.serviceId).pipe(
            map(response => {
              this.serviceId = undefined;
              return [response];
            })
          );
        }

        const queryParams = { name };
        if (this.businessId) {
          queryParams['business'] = this.businessId.toString();
        }
        return this.servicesEntityService.getWithQuery(queryParams);
      }),
      map((values: Service[]) => {
        this.hasFind = true;
        this.options = values;
        this.setProgress('determinate');
        setTimeout(() => {
          const [value] = values || [];
          if (value) {
            const options = this._auto.autocomplete.options.toArray();
            this.inputControl.setValue(options[0].value, { emitEvent: false });
            this.onSelection(null, value);
          }
        }, 10);
        return values;
      }));

    this.populate();
  }

  ngOnDestroy(): void {
  }

  setProgress(type) {
    if (this.progressBar) {
      this.progressBar.mode = type;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const { username } = changes;
    if (username) {
      this.populate();
    }
  }

  populate() {
    if (this.serviceId) {
      this.inputControl.setValue(this.serviceId);
    }
  }

  onSelection($event: MatOptionSelectionChange, preSelect?) {
    const response = $event?.source?.value || preSelect;
    this.callback.emit(response);
  }

  displayFn(response): string {
    const { name } = response || {};
    if (!name) {
      return '';
    }
    return `${ name }`;
  }
}
