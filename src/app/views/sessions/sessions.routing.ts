import { Routes } from '@angular/router';

import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { LockscreenComponent } from './page/lockscreen/lockscreen.component';
import { SigninComponent } from './page/signin/signin.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { ErrorComponent } from './page/error/error.component';
import { SessionsAreasPageComponent } from './page/sessions-areas-page/sessions-areas-page.component';
import { AuthAreasGuard } from '../../shared/guards/authAreas.guard';
import { SessionsSignupComponent } from './page/sessions-signup/sessions-signup.component';

export const SessionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: SigninComponent,
        data: { title: 'Signin' }
      },
      {
        path: 'cadastro',
        component: SessionsSignupComponent,
        data: { title: 'Cadastro' }
      },
      {
        path: 'areas',
        component: SessionsAreasPageComponent,
        data: { title: 'Áreas' },
        canActivate: [AuthAreasGuard],
      },
      {
        path: 'mudar-senha',
        component: ForgotPasswordComponent,
        data: { title: 'Mudar Senha' }
      },
      {
        path: 'lockscreen',
        component: LockscreenComponent,
        data: { title: 'Lockscreen' }
      },
      {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'Not Found' }
      },
      {
        path: 'error',
        component: ErrorComponent,
        data: { title: 'Error' }
      }
    ]
  }
];
