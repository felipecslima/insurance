import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import * as state from '../state/form.state';
import * as actions from '../state/form.actions';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private FormState = createFeatureSelector<state.FormState>('forms');
  private formValues = createSelector(this.FormState, state.FormValues);

  constructor(protected store: Store<any>) {}

  public changeFormTouched() {
    this.store.dispatch(new actions.changeFormTouched());
  }

  public getValues() {
    return this.store.select(this.formValues);
  }

  public changeFormValues(values) {
    this.store.dispatch(new actions.changeFormValues({ values }));
  }

  public changeFormValidate(isValid) {
    this.store.dispatch(new actions.changeFormValidation({ isValid }));
  }

  public settingForm(formData: any) {
    this.store.dispatch(new actions.setFormName({ formData }));
  }

  public resetForm() {
    this.store.dispatch(new actions.resetForm());
  }
}
