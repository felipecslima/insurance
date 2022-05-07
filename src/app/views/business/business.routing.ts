import { Routes } from '@angular/router';
import { ClinicPageComponent } from './pages/clinic-page/clinic-page.component';
import { BusinessSetupPageComponent } from './pages/business-setup-page/business-setup-page.component';
import {
  AdminLayoutInternalComponent
} from '../../shared/components/layouts/internal-layout/admin-layout-internal.component';

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
            component: ClinicPageComponent,
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
    ]
  }
];
