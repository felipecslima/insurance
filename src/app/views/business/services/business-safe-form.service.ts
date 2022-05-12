import { Injectable } from '@angular/core';
import { Permission } from '../../../shared/interfaces/person.interface';
import { FormFieldService } from '../../../shared/forms/services/form-field.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessSafeFormService {

  constructor(private formFieldService: FormFieldService) {
  }

  getFilterForm() {
    return [
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome do seguro:',
        placeholder: 'Digite um nome do seguro',
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
