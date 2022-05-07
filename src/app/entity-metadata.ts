import { EntityMetadataMap } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  Table: {},
  Persons: {
    entityDispatcherOptions: {
      optimisticUpdate: false
    }
  },
  Businesses: {},
  Services: {},
};

const entity = {
  Table: 'Table',
  Persons: 'Persons',
  Services: 'Services',
  Businesses: 'Businesses',
};
const pluralNames = entity;
const singularNames = entity;

export const entityConfig = {
  entityMetadata,
  pluralNames,
  singularNames,
};
