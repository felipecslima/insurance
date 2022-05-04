import { Routes } from '@angular/router';
import { ClinicPageComponent } from './pages/clinic-page/clinic-page.component';

export const BusinessRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: `clinica`,
        component: ClinicPageComponent,
        data: { title: `Lista de clinicas`, breadcrumb: `Lista de clinicas` },
      },
    ]
  }
];
