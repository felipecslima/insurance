import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES
import { ThemeService } from './services/theme.service';
import { NavigationService } from './services/navigation.service';
import { RoutePartsService } from './services/route-parts.service';
import { AuthGuard } from './guards/auth.guard';
import { UserRoleGuard } from './guards/user-role.guard';
import { ConfirmService } from './services/app-confirm/confirm.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';

import { SharedComponentsModule } from './components/shared-components.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { CollactComponentsModule } from 'collact-components';
import { CollactDesignSystemModule } from 'collact-design-system';
import { StateModule } from './services/states/state.module';
import { ClFormsModule } from './forms/forms.module';
import { SnackbarCustonComponent } from './services/snackbar-custon/snackbar-custon.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TableListComponent } from './components/table-list/table-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';
import { AuthAreasGuard } from './guards/authAreas.guard';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    FilterListComponent,
    TableListComponent,
    SnackbarCustonComponent,
  ],
  imports: [
    ClFormsModule,
    CommonModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    CollactDesignSystemModule,
    CollactComponentsModule,
    StateModule,
    FlexLayoutModule,
    NgxDatatableModule,
    RouterModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  providers: [
    ThemeService,
    NavigationService,
    RoutePartsService,
    AuthGuard,
    AuthAreasGuard,
    UserRoleGuard,
    ConfirmService,
    AppLoaderService
  ],
  exports: [
    ClFormsModule,
    CollactDesignSystemModule,
    CollactComponentsModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    TableListComponent,
    FilterListComponent,
  ]
})
export class SharedModule {
}
