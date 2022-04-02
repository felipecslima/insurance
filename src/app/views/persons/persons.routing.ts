import { Routes } from '@angular/router';
import { PersonPersonAreasPageComponent } from './pages/person-person-areas/person-person-areas-page.component';
import { PersonListPageComponent } from './pages/person-list-page/person-list-page.component';
import { PersonSetupPageComponent } from './pages/person-setup-page/person-setup-page.component';


export const OthersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PersonListPageComponent,
        data: { title: 'Lista de usuários', breadcrumb: 'Lista de usuários' }
      },
      {
        path: 'escolha-sua-area',
        component: PersonPersonAreasPageComponent,
        data: { title: 'Escolha sua área', breadcrumb: 'Escolha sua área' }
      },
      {
        path: 'setup/',
        component: PersonSetupPageComponent,
        data: { title: 'Cadastro de usuário', breadcrumb: 'Cadastro de usuário' }
      },
      {
        path: 'setup/:personId',
        component: PersonSetupPageComponent,
        data: { title: 'Edição de usuário', breadcrumb: 'Edição de usuário' }
      }
    ]
  }
];
