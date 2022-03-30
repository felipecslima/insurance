import { FormControl } from '@angular/forms';

export class ValidatorPhone {
  static validator(c: FormControl) {
    const reg = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    const reg2 = /^(?:(55\d{2})|\d{2})[6-9]\d{8}$/;
    const phoneValid = !c.value
      ? true
      : reg.test(ValidatorPhone.removeMask(c.value));
    const phoneCellValid = !c.value
      ? true
      : reg2.test(ValidatorPhone.removeMask(c.value));
    if (!c.value) {
      return null;
    }

    if (!phoneValid && !phoneCellValid) {
      return { validatePhone: true };
    }

    return null;
  }

  static removeMask(phoneValid) {
    if (phoneValid) {
      phoneValid = phoneValid.replace('(', '');
      phoneValid = phoneValid.replace(')', '');
      phoneValid = phoneValid.replace('-', '');
      phoneValid = phoneValid.replace(' ', '');
    }
    return phoneValid;
  }
}

export class ValidatorCellPhone {
  static validator(c: FormControl) {
    const reg = /^(?:(55\d{2})|\d{2})[6-9]\d{8}$/;
    const phoneValid = !c.value
      ? true
      : reg.test(ValidatorCellPhone.removeMask(c.value));
    if (!c.value) {
      return null;
    }

    if (!phoneValid) {
      return { validatePhone: true };
    }

    return null;
  }

  static removeMask(phoneValid) {
    if (phoneValid) {
      phoneValid = phoneValid.replace('(', '');
      phoneValid = phoneValid.replace(')', '');
      phoneValid = phoneValid.replace('-', '');
      phoneValid = phoneValid.replace(' ', '');
    }
    return phoneValid;
  }
}
