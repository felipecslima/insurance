import { FormControl } from '@angular/forms';

export class ValidatorInt {
  static validator(c: FormControl) {
    if (c.value) {
      const v: number = +c.value;
      if (Number.isInteger(v)) {
        return null;
      }
      return { validateInteger: true };
    }

    return null;
  }
}
