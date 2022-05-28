import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UserSelfResolver } from './shared/resolvers/self-user.resolver';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'sessions/areas',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'sessions/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session' }
      }
    ]
  },
  {
    path: ':type',
    component: AdminLayoutComponent,
    resolve: [UserSelfResolver],
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuario',
        loadChildren: () => import('./views/persons/persons.module').then(m => m.PersonsModule),
        data: { title: 'Usuários', breadcrumb: 'Usuários' },
      },
      {
        path: 'negocios',
        loadChildren: () => import('./views/business/business.module').then(m => m.BusinessModule),
        data: { title: 'Negócios', breadcrumb: 'Negócios' },
      },
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule),
        data: { title: 'Others', breadcrumb: 'OTHERS' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

