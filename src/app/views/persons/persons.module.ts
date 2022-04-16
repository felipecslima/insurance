import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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


@NgModule({
  imports: [
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
    MatSortModule
  ],
  declarations: [
    PersonListPageComponent,
    PersonSetupPageComponent
  ]
})
export class PersonsModule {
}
