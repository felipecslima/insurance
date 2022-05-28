import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { restoreState } from '../state.reducers';


// tslint:disable-next-line:no-empty-interface
export interface State {
}

export const reducers: ActionReducerMap<State> = {};


export const metaReducers: MetaReducer<State>[] = [restoreState];
