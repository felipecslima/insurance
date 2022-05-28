import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export class ValidatorCnpj {
  static validator(c: FormControl) {
    if (!c.value) {
      return null;
    }

    const valid = ValidatorCnpj.verifyCnpj(c.value);
    if (!valid) {
      return { validateCnpj: true };
    }

    return null;
  }

  static verifyCnpj(cnpj) {
    if (!cnpj) {
      return cnpj;
    }
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj === '') {
      return false;
    }

    if (cnpj.length !== 14) {
      return false;
    }

    if (cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999') {
      return false;
    }

    let size = cnpj.length - 2;
    let cpfNumber = cnpj.substring(0, size);
    const digit = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += cpfNumber.charAt(size - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digit.charAt(0), 10)) {
      return false;
    }

    size = size + 1;
    cpfNumber = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += cpfNumber.charAt(size - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;

    return result === parseInt(digit.charAt(1), 10);
  }
}
