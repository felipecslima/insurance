import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export class ValidatorCpf {
  static validator(c: FormControl) {
    if (!c.value) {
      return null;
    }

    const cpfValid = ValidatorCpf.verifyCpf(c.value);
    if (!cpfValid) {
      return { validateCpf: true };
    }

    return null;
  }

  static ValidateCpf(c: FormControl): Promise<any> | Observable<any> {
    const cpfValid = ValidatorCpf.verifyCpf(c.value);
    const promise = new Promise<any>((resolve, reject) => {
      if (!cpfValid) {
        resolve({ validateCpf: true });
      } else {
        resolve(null);
      }
    });
    return promise;
  }

  static maskCpfCnpj(v) {
    //Remove tudo o que não é dígito
    v = v.replace(/\D/g, '');

    if (v.length <= 14) {
      //CPF

      //Coloca um ponto entre o terceiro e o quarto dígitos
      v = v.replace(/(\d{3})(\d)/, '$1.$2');

      //Coloca um ponto entre o terceiro e o quarto dígitos
      //de novo (para o segundo bloco de números)
      v = v.replace(/(\d{3})(\d)/, '$1.$2');

      //Coloca um hífen entre o terceiro e o quarto dígitos
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      //CNPJ

      //Coloca ponto entre o segundo e o terceiro dígitos
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');

      //Coloca ponto entre o quinto e o sexto dígitos
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');

      //Coloca uma barra entre o oitavo e o nono dígitos
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');

      //Coloca um hífen depois do bloco de quatro dígitos
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }

    return v;
  }

  static verifyCpf(cpf) {
    if (typeof cpf !== 'string') {
      return true;
    }
    const nCpf = cpf.replace(/\./g, '');

    cpf = nCpf.replace('-', '');

    let i;

    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    ) {
      return false;
    }
    let add = 0;
    for (i = 0; i < 9; i++) {
      add += parseInt(cpf.charAt(i), 10) * (10 - i);
    }

    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }

    if (rev != parseInt(cpf.charAt(9))) {
      return false;
    }

    add = 0;
    for (i = 0; i < 10; i++) {
      add += parseInt(cpf.charAt(i), 10) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }

    if (rev != parseInt(cpf.charAt(10), 10)) {
      return false;
    }
    return true;
  }
}
