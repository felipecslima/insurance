export interface FormState {
  name?: string;
  isValid?: boolean;
  wasTouched?: boolean;
  values?: any;
  error?: null;
}

export const initialState: FormState = {
  isValid: false,
  wasTouched: false,
  values: [],
};

export const FormValues = (state: FormState) => {
  return state?.values;
};
