import { Injectable } from '@angular/core';
import { FormConfigBaseService } from '../forms/services/form-config-base.service';

@Injectable({
  providedIn: 'root'
})
export class DecoratorService {
  private static service: FormConfigBaseService | undefined = undefined;

  public constructor(public service: FormConfigBaseService) {
    DecoratorService.service = service;
  }

  static getFormService(): FormConfigBaseService {
    if (!DecoratorService.service) {
      throw new Error('FormConfigBaseService not initialized');
    }
    return DecoratorService.service;
  }
}
