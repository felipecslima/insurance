import { Routes } from '@angular/router';
import { PersonPersonAreasPageComponent } from './pages/person-person-areas/person-person-areas-page.component';
import { PersonListPageComponent } from './pages/person-list-page/person-list-page.component';


export const OthersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'escolha-sua-area',
        component: PersonPersonAreasPageComponent,
        data: { title: 'Escolha sua área', breadcrumb: 'Escolha sua área' }
      },
      {
        path: 'listagem',
        component: PersonListPageComponent,
        data: { title: 'Lista de usuários', breadcrumb: 'Lista de usuários' }
      }
    ]
  }
];
