import { FormControl } from '@angular/forms';

export class ValidatorMax {
  static validator(max: number, type?) {
    return (control: FormControl) => {
      let num: any = control.value;

      if (!num) {
        return null;
      }

      if (type === 'characters') {
        if (num.length > max) {
          return {
            maxValue: true,
          };
        }
      } else {
        num = num.toString().replace(/[^.\d]/g, '');
        num = parseFloat(num);
        if (num > max) {
          return {
            maxValue: true,
          };
        }
      }

      return null;
    };
  }
}
