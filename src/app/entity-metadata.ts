import { EntityMetadataMap } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  Table: {},
  Persons: {
    entityDispatcherOptions: {
      optimisticUpdate: false
    }
  },
};

const entity = {
  Table: 'Table',
  Persons: 'Persons',
};
const pluralNames = entity;
const singularNames = entity;

export const entityConfig = {
  entityMetadata,
  pluralNames,
  singularNames,
};
