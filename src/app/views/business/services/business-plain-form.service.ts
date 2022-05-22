import { Injectable } from '@angular/core';
import { Permission } from '../../../shared/interfaces/person.interface';
import { FormFieldService } from '../../../shared/forms/services/form-field.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessPlainFormService {

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
