import { Routes } from '@angular/router';
import { PersonListPageComponent } from './pages/person-list-page/person-list-page.component';
import { PersonSetupPageComponent } from './pages/person-setup-page/person-setup-page.component';
import {
  AdminLayoutInternalComponent
} from '../../shared/components/layouts/internal-layout/admin-layout-internal.component';
import { PersonPreSetupPageComponent } from './pages/person-pre-setup-page/person-pre-setup-page.component';
import { PersonProfilePageComponent } from './pages/person-profile-page/person-profile-page.component';
import { AuthGuard } from "../../shared/guards/auth.guard";
import { BusinessGuard } from "../../shared/guards/business.guard";


export interface ChildPersonList {
  type: string;
  pluralName: string;
  singularName: string;
}

const personCrud: ChildPersonList[] = [
  {
    type: 'cooperativa',
    pluralName: 'Cooperativas',
    singularName: 'Cooperativa'
  },
  {
    type: 'consultor',
    pluralName: 'Consultores',
    singularName: 'Consultor'
  },
  {
    type: 'clinica',
    pluralName: 'Clinicas',
    singularName: 'Clinica'
  },
  {
    type: 'medico',
    pluralName: 'Médicos',
    singularName: 'Médico'
  }
];

const children = [];
personCrud.forEach((p, id: number) => {
  children.push(
    {
      path: `${ p.type }`,
      component: AdminLayoutInternalComponent,
      data: { title: `Lista de ${ p.pluralName }`, breadcrumb: `Lista de ${ p.pluralName }`, type: p },
      canActivate: [BusinessGuard],
      children: [
        {
          path: ``,
          component: PersonListPageComponent,
          data: { title: `Lista de ${ p.pluralName }`, breadcrumb: `Lista de ${ p.pluralName }`, type: p },
        },
        {
          path: `pre-setup`,
          component: PersonPreSetupPageComponent,
          data: { title: `Cadastro de ${ p.singularName }`, breadcrumb: `Cadastro de ${ p.singularName }`, type: p }
        },
        {
          path: `setup`,
          component: PersonSetupPageComponent,
          data: { title: `Cadastro de ${ p.singularName }`, breadcrumb: `Cadastro de ${ p.singularName }`, type: p }
        },
        {
          path: `setup/:personId`,
          component: PersonSetupPageComponent,
          data: { title: `Edição de ${ p.singularName }`, breadcrumb: `Edição de ${ p.singularName }`, type: p }
        },
      ]
    },
    {
      path: `perfil`,
      component: PersonProfilePageComponent,
      data: { title: `Perfil do usuário`, breadcrumb: `Perfil do usuário`, type: p },
    }
  );
});

export const PersonRoutes: Routes = [
  {
    path: '',
    children: [
      ...children,

    ]
  }
];
