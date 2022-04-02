import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DurationInputArg2 } from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() {
    moment.locale('pt-BR');
  }

  public isDateValid(date: string, format = 'YYYY-MM-DD'): boolean {
    return moment(date, format).isValid();
  }

  public manipulateDate(qtd, startOf?, date?) {
    const format = 'YYYY-MM-DDTHH:mm:ss';
    if (startOf) {
      if (date) {
        return moment(date, 'YYYY-MM-DD')
          .startOf('day')
          .add(qtd, 'day')
          .format(format);
      }
      return moment().startOf('day').add(qtd, 'day').format(format);
    }
    if (date) {
      return moment(date, 'YYYY-MM-DD')
        .endOf('day')
        .add(qtd, 'day')
        .format(format);
    }
    return moment().endOf('day').add(qtd, 'day').format(format);
  }

  format(date, format?, toDb?, startOf?, endOf?) {
    if (toDb) {
      let momentInstance: any = moment(date, format);
      if (startOf) {
        momentInstance = momentInstance.startOf('day');
      }
      if (endOf) {
        momentInstance = momentInstance.endOf('day');
      }
      return momentInstance.format('YYYY-MM-DDTHH:mm:ss.SSS');
    }
    return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSS').format(format);
  }

  getLocalDateTime(format) {
    if (!format) {
      format = 'YYYY-MM-DDTHH:mm:ss.SSS';
    }
    return moment().format(format);
  }

  getDateFormatted(date, format, formatExpected) {
    if (date) {
      return moment(date, format).format(formatExpected);
    }
    return '';
  }

  getDayOfWeek(day) {
    return moment().day(day);
  }

  formatDateTimeToLocal(date, format, timeZoneId) {
    return momentTz.tz(new Date(date), timeZoneId).format(format);
  }

  lifeTime(date, timeZoneId) {
    return moment(
      this.formatDateTimeToLocal(date, 'YYYY-MM-DDTHH:mm:ss.SSS', timeZoneId),
    )
      .startOf('s')
      .fromNow(true);
  }

  diffByYears(date) {
    return moment().diff(date, 'years');
  }

  diff(date, unitOfTime) {
    return moment().diff(date, unitOfTime);
  }

  millisecondsToDays(milliseconds) {
    const duration = moment.duration(milliseconds, 'milliseconds');
    return duration.asDays();
  }

  addDays(date, days, format?) {
    if (format) {
      return moment(date).add(days, 'days').format(format);
    }
    return moment(date).add(days, 'days');
  }

  /**
   * Add unit from a specific date
   * @param date a date string (or now)
   * @param amount amount by unit
   * @param unit a days, months, years...
   * @param format the expected format (default is 'YYYY-MM-DDTHH:mm:ss.SSS')
   */
  intervalPeriodAdd(
    date: moment.Moment | string = this.getToday(),
    amount: number,
    unit: DurationInputArg2,
    format = 'YYYY-MM-DDTHH:mm:ss.SSS',
  ): string {
    return moment(date).add(amount, unit).format(format);
  }

  /**
   * Subtract unit from a specific date
   * @param date a date moment or string (or now)
   * @param amount amount by unit
   * @param unit a days, months, years...
   * @param startOf init of unit selected
   * @param format the expected format (default is 'YYYY-MM-DDTHH:mm:ss.SSS')
   */
  intervalPeriodSub(
    date: moment.Moment | string = this.getToday(),
    amount: number,
    unit: DurationInputArg2,
    startOf = false,
    format = 'YYYY-MM-DDTHH:mm:ss.SSS',
  ): string {
    if (startOf) {
      return moment(date).subtract(amount, unit).startOf('day').format(format);
    }
    return moment(date).subtract(amount, unit).format(format);
  }

  /**
   * Subtract days from a specific date
   * @param dateFrom a date string (or now)
   * @param days days ammount
   * @param format the expected format (default is 'YYYY-MM-DDTHH:mm:ss.SSS')
   */
  subtractDays(dateFrom, days, format = 'YYYY-MM-DDTHH:mm:ss.SSS') {
    return moment(dateFrom).subtract(days, 'd').format(format);
  }

  /**
   * Substract a specific amount of days, weeks, months, years etc. from a date
   * @param dateFrom a date string (or now)
   * @param unit days, weeks, months, years, etc.
   * @param amount quantity to subtract
   * @param format the expected format (default is 'YYYY-MM-DDTHH:mm:ss.SSS')
   */
  subtractByUnit(dateFrom, amount, unit, format = 'YYYY-MM-DDTHH:mm:ss.SSS') {
    return moment(dateFrom).subtract(amount, unit).format(format);
  }

  getToday() {
    return moment();
  }

  /**
   * Calculate the difference in DAYS from a dynamic amount and unit
   * @param amount the number amount
   * @param unit the unit string (days, months, years)
   * @param startDate the start date, if none is presented then current date is used
   */
  getDifferenceInDays(startDate: string, endDate: string): number {
    return moment(startDate).diff(endDate, 'days');
  }

  /**
   * check if a date is after another
   * @param date1 first date moment or string
   * @param date2 second date moment or string
   * @param format the date strings format (default is 'YYYY-MM-DDTHH:mm:ss.SSS')
   * @returns most recent date
   */
  isDate1AfterDate2(
    date1: string | moment.Moment,
    date2: string | moment.Moment,
    format = 'YYYY-MM-DDTHH:mm:ss.SSS',
  ): boolean {
    return moment(date1, format).isAfter(moment(date2, format));
  }

  /**
   * get first day of a date's month
   * @param date date string or moment
   * @param format the date string format (default is 'YYYY-MM-DDTHH:mm:ss.SSS')
   * @returns first day of the inserted date month
   */
  getStartOfCurrentMonth(
    date: string | moment.Moment,
    format = 'YYYY-MM-DDTHH:mm:ss.SSS',
  ): moment.Moment | string {
    return moment(date).startOf('month').format(format);
  }
}
