import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../services/app-confirm/app-confirm.component';

@Injectable({
  providedIn: 'root',
})
export class DialogComponentNameService {
  constructor() {
  }

  public getComponent(componentName: ComponentsName): ComponentsName {
    const components: any = {
       ConfirmDialogComponent,
    };
    return components[componentName];
  }
}

export type ComponentsName =
  | 'ConfirmDialogComponent'
  | string;
