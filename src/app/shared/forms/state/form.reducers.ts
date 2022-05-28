import { FormAction, FormActions } from './form.actions';
import { FormState } from './form.state';

export function formsReducers(state: any, action: FormAction): FormState {
  switch (action.type) {
    case FormActions.CHANGE_FORM_VALUES: {
      return {
        ...state,
        wasTouched: true,
        values: { ...state.values, ...action.payload.values },
      };
    }

    case FormActions.CHANGE_FORM_VALIDATION: {
      return {
        ...state,
        isValid: action.payload.isValid,
      };
    }

    case FormActions.CHANGE_FORM_TOUCHED: {
      return {
        ...state,
        wasTouched: true,
      };
    }

    case FormActions.SET_FORM_NAME: {
      return {
        ...state,
        name: action.payload.formData.name,
      };
    }

    case FormActions.RESET_FORM: {
      return {
        isValid: false,
        wasTouched: false,
        values: [],
      };
    }

    default: {
      return state;
    }
  }
}
