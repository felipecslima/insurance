import { Injectable } from '@angular/core';
import { Permission } from '../../../shared/interfaces/person.interface';
import { FormFieldService } from '../../../shared/forms/services/form-field.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessPlanFormService {

  constructor(private formFieldService: FormFieldService) {
  }

  getFilterForm() {
    return [
      this.formFieldService.getSelect({
        name: 'type',
        label: 'Tipos de plano',
        options: optionsType
      }),
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome do plano:',
        placeholder: 'Digite um nome do plano',
      }),
    ];
  }

  getDefaultForm(id: boolean, permissions: Permission) {
    const formConfig = [];
    formConfig.push(
      this.formFieldService.getSelect({
        name: 'type',
        label: 'Tipos de plano',
        options: optionsType
      }),
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome:',
        placeholder: 'Digite o nome do plano',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'quantityLife',
        title: 'Quantidade de vidas:',
        validations: ['required'],
      }),
      this.formFieldService.getCurrency({
        name: 'value',
        title: 'Valor:',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'expirationDay',
        title: 'Dia do vencimento:',
        validations: ['required'],
      }),
      this.formFieldService.getTextarea({
        name: 'description',
        title: 'Descrição:',
        placeholder: 'Digite uma descrição para o seguro',
        validations: [],
      }),
    );
    return formConfig;
  }

}

const optionsType = [
  {
    value: 'E',
    label: 'Empresarial'
  },
  {
    value: 'F',
    label: 'Pessoa física'
  },
];
