import { Injectable } from '@angular/core';
import * as numeraljs from 'numeraljs';

@Injectable({
  providedIn: 'root'
})
export class NumeralService {
  constructor() {
    numeraljs.language('pt-br', {
      delimiters: {
        thousands: '.',
        decimal: ',',
      },
      abbreviations: {
        thousand: 'mil',
        million: 'milhões',
        billion: 'b',
        trillion: 't'
      },
      ordinal: (number) => {
        return 'º';
      },
      currency: {
        symbol: 'R$'
      }
    });
    numeraljs.language('pt-br');
  }

  public formatMoney(value) {
    return numeraljs(value).format('$0,0.00');
  }

  public format(value, mask) {
    return numeraljs(value).format(mask);
  }

  public getNumeral(number, format, decimal = 0) {
    if (!number) {
      return number;
    }
    if (format === '0%') {
      return `${ parseFloat(number).toFixed(decimal) }%`;
    }
    return numeraljs(number).format(format);
  }

  public formatMoneyCurrency(balance) {
    return this.getNumeral(balance / 100, '0,0.00');
  }

  /**
   * Format a number forcing a format or not
   * @param number the number to format
   * @param decimal the number of decimals
   * @param format the expected format, if you want to force it
   */
  public getNumeralAutoFormatted(number, format = ''): string {
    const numberFormatted = number.toFixed(number % 1 === 0 ? 0 : 1);
    if (format === '0%') {
      return `${parseFloat(numberFormatted).toFixed(
        numberFormatted % 1 === 0 ? 0 : 1,
      )}%`;
    }
    if (format != '') {
      return numeraljs(numberFormatted).format(format);
    }
    return numberFormatted;
  }
}
