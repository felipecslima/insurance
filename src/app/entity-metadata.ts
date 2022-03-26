import { EntityMetadataMap } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  Persons: {},
  PageLoadData: {
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  },
};

const entity = {
  Persons: 'Persons',
};
const pluralNames = entity;
const singularNames = entity;

export const entityConfig = {
  entityMetadata,
  pluralNames,
  singularNames,
};
