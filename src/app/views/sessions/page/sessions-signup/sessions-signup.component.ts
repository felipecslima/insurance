import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PlansEntityService } from '../../../../shared/services/states/plans-entity.service';
import { noop } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { tap } from 'rxjs/operators';
import { CustomPrice } from '../../components/sessions-custom-pricing/sessions-custom-pricing.component';
import { SafesEntityService } from '../../../../shared/services/states/safes-entity.service';
import { NumeralService } from '../../../../shared/services/numeral.service';

@Component({
  selector: 'app-signup2',
  templateUrl: './sessions-signup.component.html',
  styleUrls: ['./sessions-signup.component.scss']
})
export class SessionsSignupComponent implements OnInit {
  colors = environment.color;
  selectedIndex = 0;
  changeLayout = false;

  firstFormGroup: any;
  selectSignupType: CustomPrice[] = [
    {
      label: 'Pessoal',
      description: 'Planos categoria pessoa fisica que podem ser contratados por qualquer usuário e tambem os coletivos por adesão por categoria profissional através de entidades de classe',
      value: 'F',
      selected: false,
    },
    {
      label: 'Empresarial',
      value: 'E',
      description: 'Planos categoria pessoa fisica que podem ser contratados por qualquer usuário e tambem os coletivos por adesão por categoria profissional através de entidades de classe',
      selected: false,
    },
  ];

  selectSignupPlan: CustomPrice[];
  selectSignupSafe: CustomPrice[];

  constructor(
    private numeralService: NumeralService,
    private safesEntityService: SafesEntityService,
    private plansEntityService: PlansEntityService
  ) {
    this.plansEntityService.getWithQuery({ active: 'true' }).subscribe(noop);
    this.plansEntityService.entities$
      .pipe(tap(response => {
        this.selectSignupPlan = response.map(r => {
          return {
            description: r.description,
            value: r.id.toString(),
            selected: false,
            label: r.name,
            price: `R$${numeralService.formatMoneyCurrency(r.value)}`
          };
        });
      }))
      .subscribe(noop);

    this.safesEntityService.getWithQuery({ active: 'true' }).subscribe(noop);
    this.safesEntityService.entities$
      .pipe(tap(response => {
        this.selectSignupSafe = response.map(r => {
          return {
            description: r.description,
            value: r.id.toString(),
            selected: false,
            label: r.name,
            price: `R$${numeralService.formatMoneyCurrency(r.value)}`
          };
        });
      }))
      .subscribe(noop);

  }

  ngOnInit() {

  }

  onSubmit() {
  }

  stepperChange(stepper: StepperSelectionEvent) {
    this.changeLayout = true;
    this.selectedIndex = stepper.selectedIndex;
  }
}
