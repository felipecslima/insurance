import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { environment } from '../../../../../environments/environment';
import { Unsubscribable } from 'rxjs';
import { Person } from '../../../../shared/interfaces/person.interface';

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

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  getCallback(person: Person) {
    this.isFormValid = true;
  }
}
