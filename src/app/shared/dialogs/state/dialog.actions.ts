import { createAction, props } from '@ngrx/store';
import { Dialog } from '../model/Dialog.model';

export const setData = createAction(
  '[Dialog state] Change data values from dialog',
  props<{ data: Dialog['data'] }>(),
);
export const openDialog = createAction(
  '[Dialog state] Open a dialog',
  props<{ config: Dialog['config']; component: Dialog['component'] }>(),
);

export const closeDialog = createAction(
  '[Dialog state] Close a dialog',
  props<{ dataClose: Dialog['dataClose'] }>(),
);
