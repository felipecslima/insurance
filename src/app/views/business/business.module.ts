import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from '../../shared/shared.module';

import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusinessRoutes } from './business.routing';
import { BusinessSetupPageComponent } from './pages/business-setup-page/business-setup-page.component';
import { BusinessPageComponent } from './pages/business-page/business-page.component';
import {
  BusinessUsernameSetupAutocompleteComponent
} from './components/business-username-setup-autocomplete/business-username-setup-autocomplete.component';
import { BusinessServicePageComponent } from './pages/business-service-page/business-service-page.component';
import { BusinessServiceSetupPageComponent } from './pages/business-service-setup-page/business-service-setup-page.component';
import { BusinessPlanPageComponent } from './pages/business-plan-page/business-plan-page.component';
import { BusinessSafePageComponent } from './pages/business-safe-page/business-safe-page.component';
import { BusinessSafeSetupPageComponent } from './pages/business-safe-setup-page/business-safe-setup-page.component';
import { BusinessPlanSetupPageComponent } from './pages/business-plan-setup-page/business-plan-setup-page.component';
import { BusinessNotificationPageComponent } from './pages/business-notification-page/business-notification-page.component';
import { BusinessNotificationSetupPageComponent } from './pages/business-notification-setup-page/business-notification-setup-page.component';
import { BusinessServiceLinkPageComponent } from './pages/business-service-link-page/business-service-link-page.component';
import { BusinessListPageComponent } from './pages/business-list-page/business-list-page.component';
import { BusinessServiceLinkSetupPageComponent } from './pages/business-service-link-setup-page/business-service-link-setup-page.component';
import { BusinessServiceAutocompleteComponent } from './components/business-service-autocomplete/business-service-autocomplete.component';
import { BusinessDoctorLinkPageComponent } from './pages/business-doctor-link-page/business-doctor-link-page.component';
import { BusinessDoctorLinkSetupPageComponent } from './pages/business-doctor-link-setup-page/business-doctor-link-setup-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    SharedModule,
    RouterModule.forChild(BusinessRoutes),
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
    BusinessUsernameSetupAutocompleteComponent,
    BusinessSetupPageComponent,
    BusinessPageComponent,
    BusinessServicePageComponent,
    BusinessServiceSetupPageComponent,
    BusinessPlanPageComponent,
    BusinessSafePageComponent,
    BusinessSafeSetupPageComponent,
    BusinessPlanSetupPageComponent,
    BusinessNotificationPageComponent,
    BusinessNotificationSetupPageComponent,
    BusinessServiceLinkPageComponent,
    BusinessListPageComponent,
    BusinessServiceLinkSetupPageComponent,
    BusinessServiceAutocompleteComponent,
    BusinessDoctorLinkPageComponent,
    BusinessDoctorLinkSetupPageComponent,
  ]
})
export class BusinessModule {
}
