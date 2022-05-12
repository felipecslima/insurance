import { Injectable } from '@angular/core';
import { Permission } from '../../../shared/interfaces/person.interface';
import { FormFieldService } from '../../../shared/forms/services/form-field.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessServiceFormService {

  constructor(private formFieldService: FormFieldService) {
  }

  getFilterForm() {
    return [
      this.formFieldService.getSelect({
        name: 'serviceTypeId',
        label: 'Tipos de serviços',
        options: optionsTypeService
      }),
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome do serviço:',
        placeholder: 'Digite um nome de serviço',
      }),
    ];
  }

}

const optionsTypeService = [
  {
    value: '1',
    label: 'Consulta'
  },
  {
    value: '2',
    label: 'Exame'
  },
  {
    value: '3',
    label: 'Diagnóstico'
  },
  {
    value: '4',
    label: 'Procedimento'
  },
  {
    value: null,
    label: 'Limpar tipo de serviço'
  }
];
