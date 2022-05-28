import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PlansEntityService } from '../../../../shared/services/states/plans-entity.service';
import { noop, Unsubscribable } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { tap } from 'rxjs/operators';
import { CustomPrice } from '../../components/sessions-custom-pricing/sessions-custom-pricing.component';
import { SafesEntityService } from '../../../../shared/services/states/safes-entity.service';
import { NumeralService } from '../../../../shared/services/numeral.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { PersonFormService } from '../../../persons/services/person-form.service';
import { MatStepper, MatStepperIntl } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { Plan } from '../../../../shared/interfaces/plan.interface';

@Component({
  selector: 'app-signup2',
  templateUrl: './sessions-signup.component.html',
  styleUrls: ['./sessions-signup.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
@AutoUnsubscribe()
export class SessionsSignupComponent implements OnInit, OnDestroy {
  @CombineSubscriptions()
  subscriptions: Unsubscribable;

  @ViewChild('stepper') stepper = MatStepper;


  colors = environment.color;
  selectedIndex = 0;
  changeLayout = false;

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
  formGroup: any;
  public formConfig;

  typePersonFormGroup: FormGroup;
  plans: Plan[];

  planFormGroup: FormGroup;
  safeFormGroup: FormGroup;

  formValues: any;

  brief: any[] = [];

  constructor(
    private matStepperIntl: MatStepperIntl,
    private formConfigBaseService: FormConfigBaseService,
    private formBuilder: FormBuilder,
    private personFormService: PersonFormService,
    private numeralService: NumeralService,
    private utilsService: UtilsService,
    private safesEntityService: SafesEntityService,
    private plansEntityService: PlansEntityService,
    private personsEntityService: PersonsEntityService,
  ) {
    matStepperIntl.optionalLabel = 'Opcional';
    this.subscriptions = this.plansEntityService.getWithQuery({ active: 'true' }).subscribe(noop);
    this.subscriptions = this.plansEntityService.entities$
      .pipe(tap(response => {
        this.plans = response;
      }))
      .subscribe(noop);

    this.subscriptions = this.safesEntityService.getWithQuery({ active: 'true' }).subscribe(noop);
    this.subscriptions = this.safesEntityService.getSafesActive()
      .pipe(tap(response => {
        this.selectSignupSafe = response.map(r => {
          return {
            description: r.description,
            value: r.id.toString(),
            selected: false,
            label: r.name,
            price: `R$${ numeralService.formatMoneyCurrency(r.value) }`
          };
        });
      }))
      .subscribe(noop);

    this.subscriptions = this.formConfigBaseService.getValues().subscribe(v => this.formValues = v);
  }

  ngOnInit() {
    this.typePersonFormGroup = this.formBuilder.group({
      type: ['', Validators.required],
    });
    this.planFormGroup = this.formBuilder.group({
      planId: ['', Validators.required],
    });
    this.safeFormGroup = this.formBuilder.group({
      safeId: [''],
    });

    this.setupForm();
    this.setBrief();
  }

  ngOnDestroy() {
  }

  onSubmit() {
  }

  stepperChange(stepper: StepperSelectionEvent) {
    this.changeLayout = true;
    this.selectedIndex = stepper.selectedIndex;
    if (stepper.previouslySelectedIndex > stepper.selectedIndex) {
      stepper.previouslySelectedStep.interacted = false;
    }
  }

  setupForm(): void {
    this.formConfig = this.personFormService.getDefaultForm(null);
  }

  formInstance($event: any) {
    this.formGroup = $event.form;
  }

  getTypePerson(type: string) {
    this.selectSignupPlan = this.plans.filter(r => r.type === type).map(r => {
      return {
        description: r.description,
        value: r.id.toString(),
        selected: false,
        label: r.name,
        price: `R$${ this.numeralService.formatMoneyCurrency(r.value) }`
      };
    });
    this.formConfigBaseService.setValue({ type });
    this.typePersonFormGroup.setValue({ type });
  }

  getPlan(planId: string) {
    this.formConfigBaseService.setValue({ planId });
    this.planFormGroup.setValue({ planId });
  }

  getSafe(safeId: string) {
    this.formConfigBaseService.setValue({ safeId });
    this.safeFormGroup.setValue({ safeId });
  }

  save() {
    const body = { ...this.formValues, personTypeId: 5 };
    this.personsEntityService.create(body)
      .subscribe(() => {
          this.utilsService.toast('Cadastro realizado com sucesso!', 'success');
          // TODO: Pra onde vai depois?
        }, error => {
          this.utilsService.setError(error);
        }
      );
  }

  setBrief() {
    this.subscriptions = this.formConfigBaseService.getValues()
      .pipe(tap(values => {
        const exclude = ['type', 'planId', 'safeId', 'password'];
        const { type, plan, safe } = values;
        this.brief = [
          {
            header: true,
            label: 'Tipo de plano escolhido',
          },
          {
            header: false,
            value: type === 'E' ? 'Empresarial' : 'Pessoal',
          },
          {
            header: true,
            label: 'Plano escolhido',
          },
          {
            header: false,
            label: this.selectSignupPlan.find(p => p.value === plan)?.label,
            value: this.selectSignupPlan.find(p => p.value === plan)?.price,
          },
          {
            header: true,
            label: 'Seguro escolhido',
          },
          {
            header: false,
            label: safe ? this.selectSignupSafe.find(s => s.value === safe)?.label : 'Nenhum',
            value: safe ? this.selectSignupSafe.find(s => s.value === safe)?.price : '-',
          },
          {
            header: true,
            label: 'Seus do dados',
          },
        ];

        Object.keys(values).map(key => {
            if (exclude.includes(key)) {
              return;
            }
            this.brief.push(
              {
                header: false,
                label: this.getConfigs().find(i => i.name === key)?.title?.replace(':', ''),
                value: values[key],
                key,
                config: this.getConfigs().find(i => i.name === key),
                formConfig: this.formConfig,
              });
          }
        );
      }))
      .subscribe(noop);
  }

  getConfigs() {
    const configs = [];
    this.formConfig.map(config => {
      if (config.group) {
        config.group.map(gc => {
          configs.push(gc);
        });
        return;
      }
      configs.push(config);
    });
    return configs;
  }

  arrayChunk(inputArray, perChunk) {
    return inputArray.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
  }
}
