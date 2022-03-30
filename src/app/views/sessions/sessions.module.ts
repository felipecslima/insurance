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
    SessionsAreasPageComponent,
    ForgotPasswordComponent,
    LockscreenComponent,
    SigninComponent,
    NotFoundComponent,
    ErrorComponent,
  ]
})
export class SessionsModule {
}
