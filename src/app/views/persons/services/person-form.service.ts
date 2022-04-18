import { Injectable } from '@angular/core';
import { FormFieldService } from '../../../shared/forms/services/form-field.service';

@Injectable({
  providedIn: 'root'
})
export class PersonFormService {

  constructor(private formFieldService: FormFieldService) {
  }

  public getDefaultForm(personId: boolean) {
    console.log(personId);
    const fieldAddressDescription = this.formFieldService.getText({
      name: 'description',
      title: 'Endereço:',
      placeholder: 'Digite seu endereço',
      validations: ['required'],
    });
    const fieldAddressNumber = this.formFieldService.getText({
      name: 'addressNumber',
      title: 'Número:',
      placeholder: 'Digite o número',
      validations: ['required'],
    });
    const formConfig = [
      this.formFieldService.getText({
        name: 'firstName',
        title: 'Nome:',
        placeholder: 'Digite seu nome',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'lastName',
        title: 'Sobrenome:',
        placeholder: 'Digite seu nome',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'recipient',
        title: 'Email:',
        placeholder: 'Digite seu e-mail',
        validations: ['required', 'email'],
      }),
      this.formFieldService.getText({
        name: 'phoneNumber',
        title: 'Telefone:',
        placeholder: 'Digite seu telefone ou celular',
        mask: 'PHONE',
        validations: ['required', 'phone'],
      }),
      this.formFieldService.getText({
        name: 'birthday',
        title: 'Data de nascimento:',
        placeholder: 'Digite sua data de nascimento',
        mask: 'DATE',
        validations: ['required', 'date'],
      })
    ];

    if (!personId) {
      formConfig.push(
        this.formFieldService.getText({
          name: 'username',
          title: 'CPF:',
          placeholder: 'Digite seu CPF',
          mask: 'CPF',
          validations: ['required', 'cpf'],
        })
      );
    }

    formConfig.push(
      this.formFieldService.getText({
        name: 'document',
        title: 'RG:',
        placeholder: 'Digite seu RG',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'zipcode',
        placeholder: 'Digite seu CEP',
        title: 'CEP:',
        mask: 'CEP',
        validations: ['required'],
      }),
      {
        group: [
          {
            align: {
              flex: 80,
            },
            ...fieldAddressDescription
          },
          {
            align: {
              flex: 20,
            },
            ...fieldAddressNumber
          }
        ]
      },
      this.formFieldService.getText({
        name: 'city',
        title: 'Cidade:',
        placeholder: 'Digite sua cidade',
        validations: ['required'],
      })
    );

    if (!personId) {
      formConfig.push(
        this.formFieldService.getText({
          name: 'password',
          inputType: 'password',
          title: 'Senha:',
          minValue: 8,
          validations: ['required', 'minValue'],
        })
      );
    }
    return formConfig;
  }
}
