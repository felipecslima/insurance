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

  getDefaultForm(serviceId: boolean, permissions: Permission) {
    const formConfig = [];
    formConfig.push(
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome:',
        placeholder: 'Digite o nome do serviço',
        validations: ['required'],
      }),
      this.formFieldService.getSelect({
        name: 'serviceTypeId',
        label: 'Tipos de serviços',
        options: optionsTypeService,
        validations: ['required'],
      }),
      this.formFieldService.getTextarea({
        name: 'description',
        title: 'Descrição:',
        placeholder: 'Digite uma descrição para o serviço',
        validations: ['required'],
      }),
      this.formFieldService.getCurrency({
        name: 'value',
        title: 'Custo:',
        validations: ['required'],
      }),
    );

    return formConfig;
  }

  getLinkForm() {
    const formConfig = [];
    formConfig.push(
      this.formFieldService.getCurrency({
        name: 'newValue',
        title: 'Novo valor do serviço:',
        hint: 'Deseja alterar o valor padrão do serviço'
      }),
    );
    return formConfig;
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
