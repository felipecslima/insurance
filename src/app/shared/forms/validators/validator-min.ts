import { FormControl } from '@angular/forms';

export class ValidatorMin {
  static validator(min: number, type?) {
    return (control: FormControl) => {
      let num: any = control.value;

      if (!num) {
        return null;
      }

      if (type === 'characters') {
        if (num.length < min) {
          return {
            minValue: true,
          };
        }
      } else {
        num = num.toString().replace(/[^.\d]/g, '');
        num = parseFloat(num);
        if (num < min) {
          return {
            minValue: true,
          };
        }
      }

      return null;
    };
  }
}
