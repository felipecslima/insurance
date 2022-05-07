import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FieldConfig } from 'collact-components/lib/interfaces/field.interface';
import { ValidatorMax } from '../validators/validator-max';
import { ValidatorUrl } from '../validators/validator-url';
import { ValidatorDate } from '../validators/validator-date';
import { ValidatorEmail } from '../validators/validator-email';
import { ValidatorCpf } from '../validators/validator-cpf';
import { ValidatorMin } from '../validators/validator-min';
import { ValidatorPhone } from '../validators/validator-phone';
import { ValidatorCnpj } from '../validators/validator-cnpj';

@Injectable({
  providedIn: 'root',
})
export class FormFieldService {
  public getSelect(optionsField: SelectField): FieldConfig {
    const { validations } = optionsField;
    const form = {
      ...optionsField,
      type: 'select',
      inputType: 'tel',
      validations: [],
    };
    if (validations && validations.length > 0) {
      form.validations = this.getValidations(validations);
    }
    return form;
  }

  public getCurrency(optionsField: CurrencyField): FieldConfig {
    const { validations } = optionsField;
    const form = {
      ...optionsField,
      type: 'inputCurrency',
      inputType: 'tel',
      validations: [],
    };
    if (validations && validations.length > 0) {
      form.validations = this.getValidations(validations);
    }
    return form;
  }

  public getCheckbox(optionsField: CheckboxField): FieldConfig {
    const { validations } = optionsField;
    const form: FieldConfig = {
      ...optionsField,
      type: 'checkbox',
      validations: [],
    };
    if (validations && validations.length > 0) {
      form.validations = this.getValidations(validations);
    }
    return form;
  }

  public getChip(optionsField: ChipField): FieldConfig {
    const { validations } = optionsField;
    const form = {
      ...optionsField,
      type: 'chip',
      validations: [],
    };
    if (validations && validations.length > 0) {
      form.validations = this.getValidations(validations);
    }
    return form;
  }

  public getText(optionsField: TextField): FieldConfig {
    const { validations } = optionsField;
    const form = {
      ...optionsField,
      type: 'input',
      validations: [],
    };
    if (validations && validations.length > 0) {
      form.validations = this.getValidations(validations, optionsField);
    }
    return form;
  }

  public getTextarea(optionsField: TextField): FieldConfig {
    const { validations } = optionsField;
    const form = {
      ...optionsField,
      type: 'textArea',
      validations: [],
    };

    if (validations.length > 0) {
      form.validations = this.getValidations(validations, optionsField);
    }
    return form;
  }

  private getValidations(validationsArr = [], options?) {
    const validations = [];

    if (validationsArr.find(v => v === 'maxValue')) {
      const { maxValue } = options;
      validations.push({
        name: 'maxValue',
        validator: ValidatorMax.validator(maxValue, 'characters'),
        message: `Máximo de ${ maxValue } caracteres`,
      });
    }

    if (validationsArr.find(v => v === 'minValue')) {
      const { minValue } = options;
      validations.push({
        name: 'minValue',
        validator: ValidatorMin.validator(minValue, 'characters'),
        message: `Mínimo de ${ minValue } caracteres`,
      });
    }

    if (validationsArr.find(v => v === 'required')) {
      validations.push({
        name: 'required',
        validator: Validators.required,
        message: 'O campo é obrigatório',
      });
    }

    if (validationsArr.find(v => v === 'cpf')) {
      validations.push({
        name: 'validateCpf',
        validator: ValidatorCpf.validator,
        message: 'CPF inválido',
      });
    }

    if (validationsArr.find(v => v === 'cnpj')) {
      validations.push({
        name: 'validateCnpj',
        validator: ValidatorCnpj.validator,
        message: 'CNJP inválido',
      });
    }

    if (validationsArr.find(v => v === 'url')) {
      validations.push({
        name: 'validateUrl',
        validator: ValidatorUrl.validator,
        message: 'Link com URL inválido',
      });
    }

    if (validationsArr.find(v => v === 'date')) {
      validations.push({
        name: 'validateDate',
        validator: ValidatorDate.ValidateDate,
        message: 'Data inválida',
      });
    }

    if (validationsArr.find(v => v === 'hour')) {
      validations.push({
        name: 'validateTime',
        validator: ValidatorDate.ValidateTime,
        message: 'Hora inválida',
      });
    }

    if (validationsArr.find(v => v === 'email')) {
      validations.push({
        name: 'validateEmail',
        validator: ValidatorEmail.validator,
        message: 'E-mail inválido',
      });
    }

    if (validationsArr.find(v => v === 'phone')) {
      validations.push({
        name: 'validatePhone',
        validator: ValidatorPhone.validator,
        message: 'Telefone inválido',
      });
    }
    return validations;
  }
}

export type validations =
  | 'cnpj'
  | 'cpf'
  | 'maxValue'
  | 'minValue'
  | 'required'
  | 'url'
  | 'date'
  | 'hour'
  | 'email'
  | 'phone'
  | string;

export type masks =
  | 'PERCENT'
  | 'SINGULAR_CODE'
  | 'CARD_PAN'
  | 'CARD_CVV'
  | 'CPF'
  | 'CNPJ'
  | 'CELLPHONE'
  | 'PHONE'
  | 'DATE'
  | 'DATE_MMYY'
  | 'HOUR'
  | 'CEP'
  | 'CPF_CNPJ';

export interface Options {
  label: string;
  value: string;
}

export interface Validator {
  name: string;
  validator: any;
  message: string;
}

export interface DefaultPropertyField {
  name: string;
  title?: string;
  validations?: validations[];
  hasTitleAction?: boolean;
  value?: any;
  hint?: string;
}

export interface ChipField extends DefaultPropertyField {
  bgColor: string;
  inputType: 'radio' | 'checkbox';
  options: Options[];
}

export interface CheckboxField extends DefaultPropertyField {
  label?: string;
}

export interface TextField extends DefaultPropertyField {
  label?: string;
  inputType?: 'text' | 'tel' | 'email' | 'password';
  placeholder?: string;
  mask?: masks;
  maxValue?: number;
  minValue?: number;

}

export type CurrencyField = DefaultPropertyField;

export interface SelectField extends DefaultPropertyField {
  options: Options[];
  label: string;
}
