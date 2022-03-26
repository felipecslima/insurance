import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PersonsDataService } from './persons-data.service';
import { PersonsEntityService } from './persons-entity.service';
import { TokenInterceptor } from '../../interceptors/token.interceptor';


const entityMetadata: EntityMetadataMap = {
  Persons: {},
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
  ) {
    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService('Persons', personsDataService);

  }
}
