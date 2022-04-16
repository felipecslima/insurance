import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES
import { ThemeService } from './services/theme.service';
import { NavigationService } from './services/navigation.service';
import { RoutePartsService } from './services/route-parts.service';
import { AuthGuard } from './guards/auth.guard';
import { UserRoleGuard } from './guards/user-role.guard';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
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

@NgModule({
  declarations: [
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
  ],
  providers: [
    ThemeService,
    NavigationService,
    RoutePartsService,
    AuthGuard,
    AuthAreasGuard,
    UserRoleGuard,
    AppConfirmService,
    AppLoaderService
  ],
  exports: [
    ClFormsModule,
    CollactDesignSystemModule,
    CollactComponentsModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    TableListComponent
  ]
})
export class SharedModule {
}
