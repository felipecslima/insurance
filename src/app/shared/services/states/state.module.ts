import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PersonsDataService } from './persons-data.service';
import { PersonsEntityService } from './persons-entity.service';
import { TokenInterceptor } from '../../interceptors/token.interceptor';
import { BusinessDataService } from './business-data.service';
import { ServicesDataService } from './services-data.service';
import { PlainsDataService } from './plains-data.service';


const entityMetadata: EntityMetadataMap = {
  Plains: {},
  Services: {},
  Persons: {},
  Businesses: {},
  Table: {},
};

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    PersonsEntityService,
    PersonsDataService,
  ],
})
export class StateModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private personsDataService: PersonsDataService,
    private businessDataService: BusinessDataService,
    private servicesDataService: ServicesDataService,
    private plainsDataService: PlainsDataService,
  ) {
    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService('Plains', plainsDataService);
    entityDataService.registerService('Persons', personsDataService);
    entityDataService.registerService('Businesses', businessDataService);
    entityDataService.registerService('Services', servicesDataService);
  }
}
