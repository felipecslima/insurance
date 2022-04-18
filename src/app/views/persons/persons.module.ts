import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
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
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  imports: [
    NgxMaskModule.forRoot(),
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    FileUploadModule,
    SharedModule,
    RouterModule.forChild(PersonRoutes),
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  declarations: [
    PersonListPageComponent,
    PersonSetupPageComponent,
    PersonUsernameAutocompleteComponent,
    PersonPreSetupPageComponent,
  ]
})
export class PersonsModule {
}
