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
        title: 'Nome:',
        placeholder: 'Digite o nome da clínica',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'fantasyName',
        title: 'Nome Fantasia:',
        placeholder: 'Digite o nome fantasia da clínica',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'document',
        title: 'Documento:',
        placeholder: 'Digite o documento da clínica',
        validations: ['required'],
      }),
      this.formFieldService.getText({
        name: 'description',
        title: 'Descrição:',
        placeholder: 'Digite a descrição da clínica',
        validations: ['required'],
      }),
    ];

    return formConfig;
  }
}
