import { Routes } from '@angular/router';
import { PersonListPageComponent } from './pages/person-list-page/person-list-page.component';
import { PersonSetupPageComponent } from './pages/person-setup-page/person-setup-page.component';


export interface ChildPersonList {
  type: string;
  pluralName: string;
  singularName: string;
}

const personCrud: ChildPersonList[] = [
  {
    type: 'cooperativa',
    pluralName: 'Cooperados',
    singularName: 'Cooperado'
  },
  {
    type: 'consultor',
    pluralName: 'Consultores',
    singularName: 'Consultor'
  }
];

const children = [];
personCrud.forEach((p, id: number) => {
  children.push(
    {
      path: `${ p.type }`,
      component: PersonListPageComponent,
      data: { title: `Lista de ${ p.pluralName }`, breadcrumb: `Lista de ${ p.pluralName }`, type: p }
    },
    {
      path: `${ p.type }/setup`,
      component: PersonSetupPageComponent,
      data: { title: `Cadastro de ${ p.singularName }`, breadcrumb: `Cadastro de ${ p.singularName }`, type: p }
    },
    {
      path: `${ p.type }/setup/:personId`,
      component: PersonSetupPageComponent,
      data: { title: `Edição de ${ p.singularName }`, breadcrumb: `Edição de ${ p.singularName }`, type: p }
    }
  );
});

export const PersonRoutes: Routes = [
  {
    path: '',
    children: [
      ...children
    ]
  }
];
