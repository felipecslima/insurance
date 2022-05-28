import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DialogStateModel } from './dialog.state.model';

export const selectDialogState =
  createFeatureSelector<DialogStateModel>('dialog');

export const dialogSelector = createSelector(
  selectDialogState,
  dialog => dialog,
);

export const openDialog = createSelector(selectDialogState, dialog => dialog);

export const getDataSelector = createSelector(
  selectDialogState,
  dialog => dialog.data,
);

export const getDataClose = createSelector(
  selectDialogState,
  dialog => dialog.dataClose,
);
