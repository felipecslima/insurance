import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Unsubscribable } from 'rxjs';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { FormFieldService } from '../../../../shared/forms/services/form-field.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { environment } from '../../../../../environments/environment';
import { FormConfigBaseService } from '../../../../shared/forms/services/form-config-base.service';
import { UtilsService } from '../../../../shared/services/utils.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
@AutoUnsubscribe()
export class SigninComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  @CombineSubscriptions()
  subscriptions: Unsubscribable;

  public formConfig;
  return: string;

  values: any;
  isFormValid: boolean;
  isFormLoading: boolean;

  constructor(
    private utilsService: UtilsService,
    private formConfigBaseService: FormConfigBaseService,
    private formFieldService: FormFieldService,
    private jwtAuth: JwtAuthService,
    private egretLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.subscriptions = formConfigBaseService.getValues().subscribe(values => {
      this.isFormValid = formConfigBaseService.isAllFormsValid();
      this.values = values;
    });

    this.formConfig = [
      this.formFieldService.getText({
        name: 'username',
        title: 'CPF:',
        mask: 'CPF',
        validations: ['required', 'cpf'],
      }),
      this.formFieldService.getText({
        name: 'password',
        inputType: 'password',
        title: 'Senha:',
        minValue: 6,
        validations: ['required', 'minValue'],
      }),
    ];
  }

  ngOnInit() {
    this.subscriptions = this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }

  ngOnDestroy() {
  }

  signin() {
    if (!this.isFormValid) {
      return;
    }
    this.isFormLoading = true;
    this.progressBar.mode = 'indeterminate';
    const { username, password } = this.values;
    this.jwtAuth.signin(this.utilsService.removeCPFMask(username), password)
      .subscribe(() => {
        this.router.navigateByUrl(this.return);
      }, err => {
        this.utilsService.toast('CPF ou Senha incorretos', 'error');
        this.isFormLoading = false;
        this.progressBar.mode = 'determinate';
      });
  }

  autoSignIn() {
    if (this.jwtAuth.return === '/') {
      return;
    }
    this.egretLoader.open(`Automatically Signing you in! \n Return url: ${ this.jwtAuth.return.substring(0, 20) }...`, { width: '320px' });
    setTimeout(() => {
      this.signin();
      this.egretLoader.close();
    }, 2000);
  }

}
