import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import * as moment from 'moment';

export class ValidatorDate {
  static ValidateBday(c: FormControl): Promise<any> | Observable<any> {
    const nDate = moment(c.value, 'DD/MM/YYYY', true);
    let isValid;

    if (nDate.isValid()) {
      const now = moment();
      const diff = now.diff(nDate, 'years');
      if (diff >= 2 && diff <= 150) {
        isValid = true;
      } else {
        isValid = false;
      }
    }

    const promise = new Promise<any>((resolve, reject) => {
      if (!isValid) {
        resolve({ validateDate: true });
      } else {
        resolve(null);
      }
    });
    return promise;
  }

  static ValidateDate(c: FormControl) {
    const nDate = moment(c.value, 'DD/MM/YYYY', true);
    if (!nDate.isValid()) {
      return { validateDate: true };
    }
    return null;
  }

  static ValidateTime(c: FormControl) {
    if (!c.value) {
      return null;
    }

    if (c.value.length > 5) {
      return;
    }

    const nDate = moment(c.value, 'HH:mm', true);
    const [hour] = c.value.split(':');

    if (nDate.isValid() && !isNaN(nDate.hour()) && hour && hour < 24) {
      return null;
    }

    return { validateTime: true };
  }
}
