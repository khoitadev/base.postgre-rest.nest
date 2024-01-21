import moment from 'moment';

export class DateUtils {
  static getShortenDate(inputDate: string) {
    let dateStr = '--';
    if (inputDate) {
      const date = moment(inputDate);
      if (date.isSame(moment(), 'day')) {
        dateStr = date.format('HH:mm');
      } else {
        dateStr = date.format('DD/MM');
      }
    }
    return dateStr;
  }

  static convertToTimeUnix(inputDate) {
    try {
      return moment(inputDate).unix();
    } catch (error) {
      return inputDate;
    }
  }

  static getTimeDate(inputDate: string, format = 'HH:mm DD/MM/YYYY') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getTimeWithDate(inputDate: string, format = 'HH:mm DD/MM/YYYY') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getTime(inputDate: string, format = 'HH:mm') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getTimeLatin(inputDate: string, format = 'LT') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getYear(inputDate: string, format = 'YYYY') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getMonth(inputDate: string, format = 'MM') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getDay(inputDate: string, format = 'DD') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getDate(inputDate: string, format = 'DD/MM/YYYY') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }
  static getHour(inputDate: string, format = 'HH') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getDateWithSubHour(
    inputDate: string,
    numOfHours: number,
    format = 'DD/MM/YYYY',
  ) {
    const date = new Date(inputDate);
    date.setHours(date.getHours() - numOfHours);
    return moment(date, moment.ISO_8601).format(format);
  }

  static convertDateMonth(inputDate: string, format = 'DD/MM') {
    const date = new Date(inputDate);
    return moment(date, moment.ISO_8601).format(format);
  }

  static getDateMonth(inputDate: string, format = 'DD/MM') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static convertNumberToDate(inputDate: number, format = 'DD/MM/YYYY') {
    return moment(inputDate * 1000).format(format);
  }

  static convertNumberToTime(inputDate: number, format = 'HH:mm') {
    return moment(inputDate * 1000).format(format);
  }

  static convertNumberToDateTime(
    inputDate: number,
    format = 'DD/MM/YYYY - HH:mm',
  ) {
    return moment(inputDate * 1000).format(format);
  }

  static getDateTime(inputDate: string, format = 'DD-MM-YYYY (hh:mm)') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getDateTimeNormal(inputDate: string, format = 'DD-MM-YYYY hh:mm') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }

  static getDateTimeNow(inputDate: string, format = 'MMM DD.YYYY') {
    return moment(inputDate, moment.ISO_8601).format(format);
  }
}
