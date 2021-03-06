import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from 'app/shared/shared-material.module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { LockscreenComponent } from './page/lockscreen/lockscreen.component';
import { SigninComponent } from './page/signin/signin.component';
import { SessionsRoutes } from './sessions.routing';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { ErrorComponent } from './page/error/error.component';
import { SharedModule } from '../../shared/shared.module';
import { SessionsAreasPageComponent } from './page/sessions-areas-page/sessions-areas-page.component';
import { SessionsSignupComponent } from './page/sessions-signup/sessions-signup.component';
import { SessionsCustomCheckboxComponent } from './components/sessions-custom-checkbox/sessions-custom-checkbox.component';
import { SessionsCustomPricingComponent } from './components/sessions-custom-pricing/sessions-custom-pricing.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    SharedModule,
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [
    SessionsSignupComponent,
    SessionsAreasPageComponent,
    ForgotPasswordComponent,
    LockscreenComponent,
    SigninComponent,
    NotFoundComponent,
    ErrorComponent,
    SessionsCustomCheckboxComponent,
    SessionsCustomPricingComponent,
  ]
})
export class SessionsModule {
}
