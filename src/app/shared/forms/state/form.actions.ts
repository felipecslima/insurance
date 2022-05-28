import { Action } from '@ngrx/store';

export enum FormActions {
  CHANGE_FORM_VALUES = '[Forms] Change Form values',
  CHANGE_FORM_VALIDATION = '[Forms] Change Form Validation',
  CHANGE_FORM_TOUCHED = '[Forms] Change Form Touched',
  SET_FORM_NAME = '[Forms] Set Form Name',
  RESET_FORM = '[Forms] Reset Form',
  ERROR = '[Forms] Errors',
}

export class changeFormValues implements Action {
  readonly type = FormActions.CHANGE_FORM_VALUES;
  constructor(public payload: any) {}
}

export class changeFormValidation implements Action {
  readonly type = FormActions.CHANGE_FORM_VALIDATION;
  constructor(public payload: any) {}
}

export class changeFormTouched implements Action {
  readonly type = FormActions.CHANGE_FORM_TOUCHED;
  constructor() {}
}

export class setFormName implements Action {
  readonly type = FormActions.SET_FORM_NAME;
  constructor(public payload: any) {}
}

export class resetForm implements Action {
  readonly type = FormActions.RESET_FORM;
  constructor() {}
}

export class error implements Action {
  readonly type = FormActions.ERROR;
  constructor(public payload: any) {}
}

export type FormAction =
  | changeFormValidation
  | changeFormValues
  | changeFormTouched
  | setFormName
  | resetForm
  | error;
