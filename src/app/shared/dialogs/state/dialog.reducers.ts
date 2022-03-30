import { Action, createReducer, on } from '@ngrx/store';
import { DialogStateModel } from './dialog.state.model';
import { DialogActions } from './dialog.action.types';

export const initialState: DialogStateModel = {
  id: undefined,
  data: undefined,
  isOpen: false,
  config: undefined,
  component: undefined,
  dataClose: undefined,
};

const dialogReducer = createReducer(
  initialState,
  on(DialogActions.setData, (state, action) => {
    return {
      ...state,
      data: action.data,
    };
  }),
  on(DialogActions.openDialog, (state, action) => {
    return {
      ...state,
      isOpen: true,
      config: action.config,
      component: action.component,
      id: new Date().getTime(),
    };
  }),
  on(DialogActions.closeDialog, (state, action) => {
    return {
      ...state,
      dataClose: action.dataClose,
    };
  }),
);

export function reducer(state: any | undefined, action: Action) {
  return dialogReducer(state, action);
}
