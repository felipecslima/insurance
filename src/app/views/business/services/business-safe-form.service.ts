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

  getDefaultForm(safeId: boolean, permissions: Permission) {
    const formConfig = [];
    formConfig.push(
      this.formFieldService.getText({
        name: 'name',
        title: 'Nome:',
        placeholder: 'Digite o nome do seguro',
        validations: ['required'],
      }),
      this.formFieldService.getCurrency({
        name: 'value',
        title: 'Custo:',
        validations: ['required'],
      }),
      this.formFieldService.getTextarea({
        name: 'description',
        title: 'Descrição:',
        placeholder: 'Digite uma descrição para o seguro',
        validations: ['required'],
      }),
    );
    return formConfig;
  }

}
