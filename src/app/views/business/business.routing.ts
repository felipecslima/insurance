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
import { BusinessPlanPageComponent } from './pages/business-plan-page/business-plan-page.component';
import { BusinessSafePageComponent } from './pages/business-safe-page/business-safe-page.component';
import { BusinessSafeSetupPageComponent } from './pages/business-safe-setup-page/business-safe-setup-page.component';
import { BusinessPlanSetupPageComponent } from './pages/business-plan-setup-page/business-plan-setup-page.component';
import {
  BusinessNotificationPageComponent
} from './pages/business-notification-page/business-notification-page.component';
import {
  BusinessNotificationSetupPageComponent
} from './pages/business-notification-setup-page/business-notification-setup-page.component';
import { BusinessListPageComponent } from './pages/business-list-page/business-list-page.component';
import {
  BusinessServiceLinkPageComponent
} from './pages/business-service-link-page/business-service-link-page.component';
import { BusinessGuard } from '../../shared/guards/business.guard';
import {
  BusinessServiceLinkSetupPageComponent
} from './pages/business-service-link-setup-page/business-service-link-setup-page.component';
import { BusinessDoctorLinkPageComponent } from './pages/business-doctor-link-page/business-doctor-link-page.component';
import {
  BusinessDoctorLinkSetupPageComponent
} from './pages/business-doctor-link-setup-page/business-doctor-link-setup-page.component';


const personTypeDoc = {
  type: 'clinica',
  pluralName: 'Médicos',
  singularName: 'Médico'
};


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
          {
            path: `meus-servicos`,
            component: BusinessServiceLinkPageComponent,
            data: { title: `Meus serviços`, breadcrumb: `Meus serviços` },
            canActivate: [BusinessGuard],
          },
          {
            path: `setup-link`,
            component: BusinessServiceLinkSetupPageComponent,
            data: { title: `Cadastro do serviço`, breadcrumb: `Cadastro do serviço` },
            canActivate: [BusinessGuard],
          },
        ]
      },
      {
        path: `medicos`,
        component: AdminLayoutInternalComponent,
        data: {
          title: `Lista de médicos`, breadcrumb: `Lista de médicos`, type: personTypeDoc
        },
        children: [
          {
            path: ``,
            component: BusinessDoctorLinkPageComponent,
            data: {
              title: `Lista de médicos`, breadcrumb: `Lista de médicos`, type: personTypeDoc
            },
            canActivate: [BusinessGuard],
          },
          {
            path: `setup`,
            component: BusinessDoctorLinkSetupPageComponent,
            data: {
              title: `Associar de médico aos serviços da clinica`, breadcrumb: `Associar de médico`, type: personTypeDoc
            },
            canActivate: [BusinessGuard],
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
            component: BusinessPlanPageComponent,
            data: { title: `Lista de planos`, breadcrumb: `Lista de planos` },
          },
          {
            path: `setup`,
            component: BusinessPlanSetupPageComponent,
            data: { title: `Cadastrar de plano`, breadcrumb: `Cadastro de plano` },
          },
          {
            path: `setup/:planId`,
            component: BusinessPlanSetupPageComponent,
            data: { title: `Editar de plano`, breadcrumb: `Cadastro de plano` },
          },
        ]
      },
      {
        path: `seguros`,
        component: AdminLayoutInternalComponent,
        data: { title: `Lista de seguros`, breadcrumb: `Lista de seguros` },
        children: [
          {
            path: ``,
            component: BusinessSafePageComponent,
            data: { title: `Lista de seguros`, breadcrumb: `Lista de seguros` },
          },
          {
            path: `setup`,
            component: BusinessSafeSetupPageComponent,
            data: { title: `Cadastrar de seguro`, breadcrumb: `Cadastro de seguro` },
          },
          {
            path: `setup/:safeId`,
            component: BusinessSafeSetupPageComponent,
            data: { title: `Editar de seguro`, breadcrumb: `Editar de seguro` },
          },
        ]
      },
      {
        path: `notificacao`,
        component: AdminLayoutInternalComponent,
        data: { title: `Notificação Médica`, breadcrumb: `Lista de notificações` },
        children: [
          {
            path: ``,
            component: BusinessNotificationPageComponent,
            data: { title: `Notificação Médica`, breadcrumb: `Lista de seguros` },
          },
          {
            path: `setup`,
            component: BusinessNotificationSetupPageComponent,
            data: { title: `Cadastro de notificação`, breadcrumb: `Cadastro de notificação` },
          },
          {
            path: `setup/:notificationId`,
            component: BusinessNotificationSetupPageComponent,
            data: { title: `Editar notificação`, breadcrumb: `Editar notificação` },
          },
        ]
      },
      {
        path: `lista`,
        component: AdminLayoutInternalComponent,
        data: { title: `Lista de clinicas`, breadcrumb: `Lista de clinicas` },
        children: [
          {
            path: ``,
            component: BusinessListPageComponent,
            data: { title: `Lista de clinicas`, breadcrumb: `Lista de clinicas` },
          },
        ]
      },
    ]
  }
];

