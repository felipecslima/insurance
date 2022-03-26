import { Action, ActionReducer } from '@ngrx/store';

export function restoreState(reducer: ActionReducer<any>) {
  return (state: any, action: any) => {
    if (action.type === ActionTypes.RESTORE_CACHE) {
      state = action.payload;
    }

    return reducer(state, action);
  };
}

export class ActionTypes {
  static RESTORE_CACHE = '[App] restore cache';
}

export class RestoreCache implements Action {
  readonly type = ActionTypes.RESTORE_CACHE;
  constructor(public payload: any) {}
}
