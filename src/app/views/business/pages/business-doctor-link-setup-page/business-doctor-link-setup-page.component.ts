import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { noop, Unsubscribable } from 'rxjs';
import { Permission, Person } from '../../../../shared/interfaces/person.interface';
import { ChildPersonList } from '../../../persons/persons.routing';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../../../shared/services/url.service';
import { PersonFormService } from '../../../persons/services/person-form.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { DateService } from '../../../../shared/services/date.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { RoutePartsService } from '../../../../shared/services/route-parts.service';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { Service } from '../../../../shared/interfaces/service.interface';
import { BusinessSelectedService } from '../../business-selected.service';
import { ServicesEntityService } from '../../../../shared/services/states/services-entity.service';

@Component({
  selector: 'business-doctor-link-setup-page',
  templateUrl: './business-doctor-link-setup-page.component.html',
  styleUrls: ['./business-doctor-link-setup-page.component.scss']
})
@AutoUnsubscribe()
export class BusinessDoctorLinkSetupPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  person: Person;
  businessId: number;

  public formConfig;
  public values: any;
  public isFormValid: boolean;
  public isFormLoading: boolean;
  private readonly personId: number;
  private typePerson: ChildPersonList;

  permission: Permission = this.jwtAuthService.getPermission('medico');

  services: Service[] = [];

  constructor(
    private businessSelectedService: BusinessSelectedService,
    private router: Router,
    private urlService: UrlService,
    private personFormService: PersonFormService,
    private jwtAuthService: JwtAuthService,
    private dateService: DateService,
    private utilsService: UtilsService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private route: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private personsEntityService: PersonsEntityService,
    private servicesEntityService: ServicesEntityService,
  ) {
    routePartsService.generateRouteParts(route.snapshot);

    const personId = route.snapshot.paramMap.get('personId');
    if (personId) {
      this.personId = parseInt(personId, 10);
    }

    this.subscribers = this.businessSelectedService.get().pipe(
      tap(business => {
        this.businessId = business.id;
        this.formConfigBaseService.setValue({ businessId: business.id });
      })
    ).subscribe(noop);

    this.subscribers = route.data
      .pipe(
        take(1),
        switchMap((data) => {
          this.typePerson = data.type;

          this.subscribers = this.personsEntityService.getServerCurrent(this.permission.id).subscribe(noop);
          return personsEntityService.getCurrent();
        }),
        tap(person => {
          this.person = person;
          this.formConfigBaseService.setValue({ personDoctorId: person.id });
        })
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }
    console.log(this.geBody());
    this.servicesEntityService.saveLinkPerson(this.geBody())
      .subscribe(() => {
        this.utilsService.toast('Médico salvo com sucesso!', 'success');
        this.router.navigate([this.urlService.getUserList(this.typePerson.type)]);
      }, error => {
        this.utilsService.setError(error);
      });
  }

  getService($event: Service) {
    const someService = this.services.some(s => s.id === $event.id);
    if (!someService) {
      this.services.push($event);
    }
    this.checkFormValid();
  }

  removeService(service: Service) {
    this.services = this.services.filter(s => s.id !== service.id);
    this.checkFormValid();
  }

  getPerson($event: Person) {
    this.person = $event;
    this.checkFormValid();
  }

  checkFormValid() {
    this.isFormValid = !!this.person && this.services.length > 0;
  }

  geBody(): { businessId: number; serviceId: { id: number }[], personDoctorId: number } {
    const user = this.person.user.find(u => u.personTypeId === this.permission.id);
    return {
      businessId: this.businessId,
      serviceId: this.services.map(s => {
        return {
          id: s.id
        };
      }),
      personDoctorId: user.id
    };
  }
}
