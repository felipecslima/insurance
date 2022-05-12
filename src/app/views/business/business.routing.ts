import { Routes } from '@angular/router';
import { BusinessSetupPageComponent } from './pages/business-setup-page/business-setup-page.component';
import {
  AdminLayoutInternalComponent
} from '../../shared/components/layouts/internal-layout/admin-layout-internal.component';
import { BusinessPageComponent } from './pages/business-page/business-page.component';
import { BusinessServicePageComponent } from './pages/business-service-page/business-service-page.component';
import {
  BusinessServiceSetupPageComponent
} from './pages/business-service-setup-page/business-service-setup-page.component';
import { BusinessPlainPageComponent } from './pages/business-plain-page/business-plain-page.component';

export const BusinessRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: `clinica`,
        component: AdminLayoutInternalComponent,
        data: { title: `Lista de clinicas`, breadcrumb: `Lista de clinicas` },
        children: [
          {
            path: ``,
            component: BusinessPageComponent,
            data: { title: `Lista de clinicas`, breadcrumb: `Lista de clinicas` },
          },
          {
            path: `setup`,
            component: BusinessSetupPageComponent,
            data: { title: `Cadastrar de clinica`, breadcrumb: `Cadastro de clinica` },
          },
          {
            path: `setup/:businessId`,
            component: BusinessSetupPageComponent,
            data: { title: `Cadastrar de clinica`, breadcrumb: `Cadastro de clinica` },
          },
        ]
      },
      {
        path: `servicos`,
        component: AdminLayoutInternalComponent,
        data: { title: `Lista de serviços`, breadcrumb: `Lista de serviços` },
        children: [
          {
            path: ``,
            component: BusinessServicePageComponent,
            data: { title: `Lista de serviços`, breadcrumb: `Lista de serviços` },
          },
          {
            path: `setup`,
            component: BusinessServiceSetupPageComponent,
            data: { title: `Cadastrar de serviço`, breadcrumb: `Cadastro de serviço` },
          },
          {
            path: `setup/:serviceId`,
            component: BusinessServiceSetupPageComponent,
            data: { title: `Editar de serviço`, breadcrumb: `Cadastro de serviço` },
          },
        ]
      },
      {
        path: `planos`,
        component: AdminLayoutInternalComponent,
        data: { title: `Lista de planos`, breadcrumb: `Lista de planos` },
        children: [
          {
            path: ``,
            component: BusinessPlainPageComponent,
            data: { title: `Lista de planos`, breadcrumb: `Lista de planos` },
          },
          {
            path: `setup`,
            component: BusinessServiceSetupPageComponent,
            data: { title: `Cadastrar de plano`, breadcrumb: `Cadastro de plano` },
          },
          {
            path: `setup/:serviceId`,
            component: BusinessServiceSetupPageComponent,
            data: { title: `Editar de plano`, breadcrumb: `Cadastro de plano` },
          },
        ]
      },
    ]
  }
];
