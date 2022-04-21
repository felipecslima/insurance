import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { environment } from '../../../../../environments/environment';
import { noop, Unsubscribable } from 'rxjs';
import { Person } from '../../../../shared/interfaces/person.interface';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { RoutePartsService } from '../../../../shared/services/route-parts.service';
import { ChildPersonList } from '../../persons.routing';
import { switchMap, take, tap } from 'rxjs/operators';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';

@Component({
  selector: 'person-pre-setup-page',
  templateUrl: './person-pre-setup-page.component.html',
  styleUrls: ['./person-pre-setup-page.component.scss']
})
@AutoUnsubscribe()
export class PersonPreSetupPageComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;
  isFormValid: boolean;

  private typePerson: ChildPersonList;
  public values: Record<string, string | number>;
  private person: Person;

  constructor(
    private jwtAuthService: JwtAuthService,
    private formConfigBaseService: FormConfigBaseService,
    private router: Router,
    private route: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private urlService: UrlService,
    private utilsService: UtilsService,
    private personsEntityService: PersonsEntityService) {

    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
    });
    routePartsService.generateRouteParts(route.snapshot);

    this.subscribers = route.data
      .pipe(
        take(1),
        tap(data => {
          this.typePerson = data.type;
        }),
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  getCallback(person: Person) {
    this.person = person;
    this.isFormValid = true;
    this.personsEntityService.populate(person);
  }

  save(): void {
    const personTypeId = this.jwtAuthService.getPermission(this.typePerson.type);
    this.values = { ...this.values, ...{ personTypeId: personTypeId.id, userId: undefined } };
    this.personsEntityService.save(this.values).subscribe(() => {
      this.utilsService.toast('Usuário salvo com sucesso!', 'success');
      this.router.navigate([this.urlService.getUserList(this.typePerson.type)]);
    }, error => {
      this.utilsService.setError(error);
    });
  }

  createObject() {

  }
}
