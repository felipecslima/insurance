import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { environment } from '../../../../../environments/environment';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { Unsubscribable } from 'rxjs';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../../../shared/services/date.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
@AutoUnsubscribe()
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @CombineSubscriptions()
  subscriptions: Unsubscribable;

  color = environment.color;

  public formConfig;

  values: any;
  isFormValid: boolean;
  isFormLoading: boolean;

  titlePage: string;
  titleButton: string;

  pageChangePassword = false;
  token: string;

  constructor(
    private dateService: DateService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private personsEntityService: PersonsEntityService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
  ) {

    this.subscriptions = route.queryParams.subscribe(queryParams => {
      const { t } = queryParams;
      if (t) {
        this.token = t;
        this._setFormChangePassword();
        return;
      }
      this._setFormSendEmail();
    });

    this.subscriptions = formConfigBaseService.getValues().subscribe(values => {
      this.isFormValid = formConfigBaseService.isAllFormsValid();
      this.values = values;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  private _setFormChangePassword() {
    this.pageChangePassword = true;
    this.titlePage = 'Crie uma nova senha';
    this.titleButton = 'Criar nova senha';
    this.formConfig = [
      this.formFieldService.getText({
        name: 'password',
        inputType: 'password',
        title: 'Senha:',
        minValue: 8,
        validations: ['required', 'minValue'],
      }),
      this.formFieldService.getText({
        name: 'passwordConfirm',
        inputType: 'password',
        title: 'Confirme sua senha:',
        minValue: 8,
        validations: ['required', 'minValue'],
      }),
    ];
  }

  private _setFormSendEmail() {
    this.titlePage = 'Um link de recuperação será enviado para seu e-mail cadastrado';
    this.titleButton = 'Receber link de recuperação';
    this.formConfig = [
      this.formFieldService.getText({
        name: 'email',
        title: 'Email:',
        validations: ['required', 'email'],
      }),
      this.formFieldService.getText({
        name: 'birthday',
        title: 'Aniversário:',
        mask: 'DATE',
        validations: ['required', 'date'],
      }),
    ];
  }

  submit(): void {
    if (this.pageChangePassword) {
      this.submitChangePassword();
      return;
    }
    this.submitEmail();
  }

  submitChangePassword(): void {
    const { password, passwordConfirm } = this.values;
    if (password !== passwordConfirm) {
      this.utilsService.toast('Senha precisa ser igual ao campo de confirme sua senha', 'error');
      return;
    }

    if (!this.isFormValid) {
      return;
    }
    this.isFormLoading = true;
    this.progressBar.mode = 'indeterminate';


    this.personsEntityService.changePassword(password, passwordConfirm, this.token)
      .subscribe(() => {
        this.isFormLoading = false;
        this.isFormValid = false;
        this.progressBar.mode = 'determinate';
        this.utilsService.toast('Senha alterada com sucesso!', 'success');
      }, err => {
        this.utilsService.setError(err);
        this.isFormLoading = false;
        this.progressBar.mode = 'determinate';
      });
  }

  submitEmail(): void {
    if (!this.isFormValid) {
      return;
    }
    this.isFormLoading = true;
    this.progressBar.mode = 'indeterminate';
    const { email, birthday: bday } = this.values;
    const birthday = this.dateService.getDateFormatted(bday, 'DD/MM/YYYY', 'YYYY-MM-DD');
    this.personsEntityService.forgotPassword(email, birthday)
      .subscribe(() => {
        this.isFormLoading = false;
        this.isFormValid = false;
        this.progressBar.mode = 'determinate';
        this.utilsService.toast('Verifique sua caixa de entrada ou o spam do seu E-mail', 'success');
      }, err => {
        this.utilsService.setError(err);
        this.isFormLoading = false;
        this.progressBar.mode = 'determinate';
      });
  }
}
