import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';

import { PersonRoutes } from './persons.routing';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { PersonListPageComponent } from './pages/person-list-page/person-list-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { PersonSetupPageComponent } from './pages/person-setup-page/person-setup-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  PersonUsernameAutocompleteComponent
} from './components/person-username-autocomplete/person-username-autocomplete.component';
import { PersonPreSetupPageComponent } from './pages/person-pre-setup-page/person-pre-setup-page.component';
import { PersonProfilePageComponent } from './pages/person-profile-page/person-profile-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    SharedModule,
    RouterModule.forChild(PersonRoutes),
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [
    PersonListPageComponent,
    PersonSetupPageComponent,
    PersonUsernameAutocompleteComponent,
    PersonPreSetupPageComponent,
    PersonProfilePageComponent,
  ]
})
export class PersonsModule {
}
