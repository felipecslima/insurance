import { Injectable } from '@angular/core';
import { Permission } from '../../../shared/interfaces/person.interface';
import { FormFieldService } from '../../../shared/forms/services/form-field.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessFormService {

  constructor(private formFieldService: FormFieldService) { }

  getDefaultForm(businessId: boolean, permissions: Permission) {
    const formConfig = [
      this.formFieldService.getText({
        name: 'name',
        title: 'Razão Social:',
        placeholder: 'Digite a Razão Social',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'fantasyName',
        title: 'Nome Fantasia:',
        placeholder: 'Digite o nome fantasia',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'document',
        title: 'CNPJ:',
        placeholder: 'Digite o CNPJ',
        validations: ['required'],
        mask: 'CNPJ',
      }),
      this.formFieldService.getText({
        name: 'description',
        title: 'Descrição:',
        placeholder: 'Digite a descrição',
        validations: ['required'],
      }),
      // Dados de endereço
      this.formFieldService.getText({
        name: 'address_zipcode',
        title: 'CEP:',
        placeholder: 'Digite o CEP',
        validations: ['required'],
        mask: 'CEP',
      }),
      this.formFieldService.getText({
        name: 'address_description',
        title: 'Logradouro:',
        placeholder: 'Digite o logradouro',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'address_city',
        title: 'Cidade:',
        placeholder: 'Digite a cidade',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'address_number',
        title: 'Número:',
        placeholder: 'Digite o número',
        validations: ['required'],
      }),
      // Dados de contato
      this.formFieldService.getText({
        name: 'phone_number',
        title: 'Telefone:',
        placeholder: 'Digite um número de telefone/celular',
        mask: 'CELLPHONE',
        validations: ['phone'],
      }),
      // Dados de Endereço eletrônico
      this.formFieldService.getText({
        name: 'recipient',
        title: 'E-mail:',
        placeholder: 'Digite um endereço de e-mail',
        validations: ['email'],
      }),
    ];

    return formConfig;
  }
}
