import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class TableEntityService extends EntityCollectionServiceBase<any> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Table', serviceElementsFactory);
  }

}
