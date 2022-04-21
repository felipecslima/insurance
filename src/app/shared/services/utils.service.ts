import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarCustonComponent } from './snackbar-custon/snackbar-custon.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  stopInterval: any;
  timeSpinner = 0;
  Window: any = window;

  constructor(public snackBar: MatSnackBar) {
  }

  setError(error: any): void {
    const { message = 'Erro desconhecido' } = error || {};
    this.toast(message, 'error');
  }

  public removeEmpty(obj): any {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] === Object(obj[key])) {
        newObj[key] = this.removeEmpty(obj[key]);
      } else if (obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }

  public toast(message, type) {
    const timeOut = 4000;
    switch (type) {
      case 'success':
        this.snackBar.openFromComponent(SnackbarCustonComponent, {
          data: { icon: 'cl-correct-focus', message },
          duration: timeOut / 2,
        });
        break;
      case 'error':
        this.snackBar.openFromComponent(SnackbarCustonComponent, {
          data: { icon: 'cl-info-circle', message },
          duration: timeOut,
        });
        break;
      case 'message':
        this.snackBar.open(message, '', {
          duration: timeOut,
        });
        break;
    }
  }

  public copyClipboard(value, msg = 'Texto') {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public removeMaskPhone(phoneValid) {
    if (!phoneValid) {
      return phoneValid;
    }

    phoneValid = phoneValid.replace('(', '');
    phoneValid = phoneValid.replace(') ', '');
    phoneValid = phoneValid.replace('-', '');
    phoneValid = phoneValid.replace(' ', '');
    return phoneValid;
  }

  public mask(text, mask) {
    if (!text) {
      return text;
    }

    text = text.toString();
    const er = /[^0-9/ (),.-]/;
    er.lastIndex = 0;

    if (er.test(text)) {
      // verifica se é string, caso seja então apaga
      return text.substring(0, text.length - 1);
    }
    let booleanMask;
    const exp = /\-|\.|\/|\(|\)| /g;
    const onlyNumbers = text.toString().replace(exp, '');
    let textPosition = 0;
    let newText = '';
    let maskSize = onlyNumbers.length;
    for (let i = 0; i <= maskSize; i++) {
      booleanMask =
        mask.charAt(i) === '-' ||
        mask.charAt(i) === '.' ||
        mask.charAt(i) === '/';
      booleanMask =
        booleanMask ||
        mask.charAt(i) === '(' ||
        mask.charAt(i) === ')' ||
        mask.charAt(i) === ' ';
      if (booleanMask) {
        newText += mask.charAt(i);
        maskSize++;
      } else {
        newText += onlyNumbers.charAt(textPosition);
        textPosition++;
      }
    }
    return newText;
  }

  public recreateUrlNavigate(urlRedirect) {
    const url = decodeURIComponent(urlRedirect);
    const params = url.split('?');
    const [nUrl, paramsUrl] = params;

    const queryParams = {};
    if (paramsUrl) {
      const eachParams = paramsUrl.split('&');
      if (eachParams && eachParams.length > 0) {
        eachParams.map(obj => {
          const nParams = obj.split('=');
          queryParams[nParams[0]] = nParams[1];
        });
      }
    }

    return { url: nUrl, queryParams };
  }

  maskPhone(value) {
    if (!value) {
      return value;
    }
    value = value.replace(/(?:https\:\/\/wa\.me\/55)/, '');
    value = value.replace(/(?:tel\:55)/, '');
    const fixMask =
      value.length === 10
        ? /(\d{0,2})(\d{0,4})(\d{0,4})/
        : /(\d{0,2})(\d{0,5})(\d{0,4})/;
    const x = value.replace(/\D/g, '').match(fixMask);
    return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  }

  public isBase64(str) {
    if (str === '' || str.trim() === '') {
      return false;
    }
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  public compareObjects(a, b) {
    if (a === null) {
      if (b === null) {
        return true;
      }
      console.error('object is null while the other is not');
      return false;
    }
    if (a === undefined) {
      if (b === undefined) {
        return true;
      }
      console.error('object is undefined while the other is not');
      return false;
    }
    if (b === null || b === undefined) {
      console.error('object is null or undefined while the other is not');
      return false;
    }

    // Create sorted arrays of property names
    const aKeys = Object.getOwnPropertyNames(a).sort();
    const bKeys = Object.getOwnPropertyNames(b).sort();

    // If number of properties is different,
    // objects are not equivalent
    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (let i = 0; i < aKeys.length; i++) {
      const aKey = aKeys[i];
      const bKey = bKeys[i];

      // Keys should be equal here because key arrays are sorted
      if (aKey !== bKey) {
        return false;
      }

      const aValue = a[aKey];
      const bValue = b[bKey];

      if (typeof aValue !== typeof bValue) {
        console.error(
          `Object with key '${ aKey }' have different types: '${ typeof aValue }' and '${ typeof bValue }'`,
        );
        return false;
      }

      if (typeof aValue === 'object') {
        if (this.compareObjects(aValue, bValue) === false) {
          return false;
        }
      } else if (aValue !== bValue) {
        console.error(
          `Object with key '${ aKey }' have different values: '${ aValue }' and '${ bValue }'`,
        );
        return false;
      }
    }

    return true;
  }

  public captalizeString(string) {
    if (!string) {
      return '';
    }
    return string.toLowerCase().replace(/^./, str => str.toUpperCase());
  }

  public groupBy(listToGroup, groupByKey) {
    return listToGroup.reduce((reducedValue, elem) => {
      const groupByValue = elem[groupByKey] || Math.random();
      const valuesWithSameKey = reducedValue.get(groupByValue) || [];
      valuesWithSameKey.push(elem);
      reducedValue.set(groupByValue, valuesWithSameKey);
      return reducedValue;
    }, new Map());
  }

  public timerCountDown(sec) {
    this.timeSpinner = 0;
    const ms = sec * 1000;
    const intervalMs = ms / 100;
    let lastTimer: any;
    clearInterval(this.stopInterval);
    this.stopInterval = setInterval(() => {
      if (this.timeSpinner <= 100) {
        lastTimer = new Date().getTime();
        this.timeSpinner = this.timeSpinner + 1;
      } else {
        clearInterval(this.stopInterval);
      }
    }, intervalMs);
  }

  public arrayChunk(arr, chunkSize) {
    const groups = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  }

  public clearCpf(cpf) {
    const nCpf = cpf.replace(/\./g, '');
    return nCpf.replace('-', '');
  }

  isCPF(value: string): boolean {
    const regexToCheckIsCpf = /(^)\d{2,3}\.?\d{3}\.?\d{3}\-?\d{2}(?:$|\W)/;
    const result = regexToCheckIsCpf.exec(value);
    return !!result;
  }

  isEmail(value: string): boolean {
    const regexToCheckIsEmail = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/;
    const result = regexToCheckIsEmail.exec(value);
    return !!result;
  }

  isPhone(value: string): boolean {
    const reg = /^(?:(55\d{2})|\d{2})[6-9]\d{8}$/;
    const phoneValid = !value ? true : reg.test(this.removePhoneMask(value));
    if (!value) {
      return false;
    }

    return phoneValid;
  }

  public removeCPFMask(cpf) {
    if (cpf) {
      cpf = cpf.replace(/\./g, '');
      cpf = cpf.replace(/\-/g, '');
    }
    return cpf;
  }

  public removePhoneMask(phoneValid) {
    if (phoneValid) {
      phoneValid = phoneValid.replace(/\s/g, '');
      phoneValid = phoneValid.replace('+', '');
      phoneValid = phoneValid.replace('(', '');
      phoneValid = phoneValid.replace(')', '');
      phoneValid = phoneValid.replace('-', '');
    }
    return phoneValid;
  }

  public phoneFormat(phone, removePrefixOnly?) {
    if (!phone) {
      return phone;
    }
    phone = phone?.replace('+55', '');
    if (removePrefixOnly) {
      return phone;
    }
    phone = phone.replace(/\D/g, '');
    phone = phone.replace(/^(\d\d)(\d)/g, '($1) $2');
    // TODO - Phone sem o digito 9
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
    return phone;
  }

  public verifyCpf(cpf) {
    if (cpf) {
      const nCpf = cpf.replace(/\./g, '');
      cpf = nCpf.replace('-', '');
      let i;

      if (
        cpf.length !== 11 ||
        cpf === '00000000000' ||
        cpf === '11111111111' ||
        cpf === '22222222222' ||
        cpf === '33333333333' ||
        cpf === '44444444444' ||
        cpf === '55555555555' ||
        cpf === '66666666666' ||
        cpf === '77777777777' ||
        cpf === '88888888888' ||
        cpf === '99999999999'
      ) {
        return false;
      }
      let add = 0;
      for (i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i), 10) * (10 - i);
      }

      let rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) {
        rev = 0;
      }

      if (rev !== parseInt(cpf.charAt(9), 9)) {
        return false;
      }

      add = 0;
      for (i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i), 10) * (11 - i);
      }
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) {
        rev = 0;
      }

      return rev === parseInt(cpf.charAt(10), 10);
    }
  }

  public maskCpfCnpj(v) {
    if (!v) {
      return v;
    }
    // Remove tudo o que não é dígito
    v = v.replace(/\D/g, '');

    if (v.length < 14) {
      // CPF

      // Coloca um ponto entre o terceiro e o quarto dígitos
      v = v.replace(/(\d{3})(\d)/, '$1.$2');

      // Coloca um ponto entre o terceiro e o quarto dígitos
      // de novo (para o segundo bloco de números)
      v = v.replace(/(\d{3})(\d)/, '$1.$2');

      // Coloca um hífen entre o terceiro e o quarto dígitos
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ

      // Coloca ponto entre o segundo e o terceiro dígitos
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');

      // Coloca ponto entre o quinto e o sexto dígitos
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');

      // Coloca uma barra entre o oitavo e o nono dígitos
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');

      // Coloca um hífen depois do bloco de quatro dígitos
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v;
  }

  public setMaskCpf(v) {
    if (!v) {
      return v;
    }
    const len = v.length;
    if (len > 3) {
      v.replace(/(\d{3})(\d)/, '$1.$2');
    } else if (len > 3 && len < 9) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
    } else if (len > 9) {
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return v;
  }

  public arrayUnique(data) {
    const resArr = [];
    data.filter((item) => {
      const i = resArr.findIndex(x => x.id === item.id);
      if (i <= -1) {
        resArr.push(item);
      }
      return null;
    });
    return resArr;
  }

  removeAccents(str) {
    if (!str || str === '') {
      return str;
    }
    const accents =
      'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    const accentsOut =
      'AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    str = str.split('');
    const strLen = str.length;
    let i;
    let x;
    for (i = 0; i < strLen; i++) {
      x = accents.indexOf(str[i]);
      if (x !== -1) {
        str[i] = accentsOut[x];
      }
    }
    return str.join('');
  }

  public slugify(str: string) {
    return this.removeAccents(str)
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '');
  }

  public dotComma(string) {
    return string.toString().replace(/[,.]/g, (m) => {
      // m is the match found in the string
      // If `,` is matched return `.`, if `.` matched return `,`
      return m === ',' ? '.' : ',';
    });
  }

  public roundDown(number, decimals) {
    decimals = decimals || 0;
    return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  public capitalizeFirstLetter(str?) {
    str = str.toString();
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  public basename(path) {
    if (path) {
      return path.split('/').reverse()[0];
    }
  }

  public parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  /**
   * Solution from https://gist.github.com/fupslot/5015897
   *
   * */
  public base64ToBlobDataUri(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const bb = new Blob([ab]);
    return bb.slice(0, bb.size, mimeString);
  }

  public convertBase64ToBlob(Base64Image: any) {
    const parts = Base64Image.split(';base64,');
    const imageType = parts[0].split(':')[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }

  public hexToBinary(s) {
    const lookup = {
      '0': '0000',
      '1': '0001',
      '2': '0010',
      '3': '0011',
      '4': '0100',
      '5': '0101',
      '6': '0110',
      '7': '0111',
      '8': '1000',
      '9': '1001',
      a: '1010',
      b: '1011',
      c: '1100',
      d: '1101',
      e: '1110',
      f: '1111',
      A: '1010',
      B: '1011',
      C: '1100',
      D: '1101',
      E: '1110',
      F: '1111',
    };

    let binValue = '';

    for (let i = 0, len = s.length; i < len; i++) {
      binValue += lookup[s[i]];
    }

    return binValue;
  }

  public createWhatsAppLink(phoneNumber, text?) {
    let url;
    if (phoneNumber) {
      url = `https://wa.me/${ phoneNumber }`;
      if (text) {
        url = `${ url }?text=${ encodeURIComponent(text) }`;
      }
    }
    return url;
  }

  public createEmailLink(email, text?, subject?) {
    let url;
    if (email) {
      url = `mailto:${ email }`;
      if (subject || text) {
        url = `${ url }?`;
        if (subject) {
          url = url + `subject=${ subject }`;
        }
        if (subject && text) {
          url = url + '&';
        }
        if (text) {
          url = url + `body=${ text }`;
        }
      }
    }
    return url;
  }

  public isIOS() {
    return !!(
      window &&
      typeof this.Window.webkit !== 'undefined' &&
      this.Window.webkit.messageHandlers &&
      this.Window.webkit.messageHandlers.NativeInterface
    );
  }

  public isMobile() {
    if (
      window &&
      typeof this.Window.NativeInterface !== 'undefined' &&
      this.Window.NativeInterface
    ) {
      return true;
    } else if (
      window &&
      typeof this.Window.webkit !== 'undefined' &&
      this.Window.webkit.messageHandlers &&
      this.Window.webkit.messageHandlers.NativeInterface
    ) {
      return true;
    }

    return false;
  }

  public isDesktop() {
    if (window.innerWidth >= 600) {
      return true;
    }
    return false;
  }

  /**
   * Translates the Day Of Week enum
   * @param dow
   */
  public translateDayOfWeek(dow) {
    const days = {
      MONDAY: 'Segunda',
      TUESDAY: 'Terça',
      WEDNESDAY: 'Quarta',
      THURSDAY: 'Quinta',
      FRIDAY: 'Sexta',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    };
    return days[dow] ?? '';
  }
}
