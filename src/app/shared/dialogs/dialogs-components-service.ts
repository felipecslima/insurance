import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../services/app-confirm/app-confirm.component';
import { FilterListComponent } from '../components/filter-list/filter-list.component';

@Injectable({
  providedIn: 'root',
})
export class DialogComponentNameService {
  constructor() {
  }

  public getComponent(componentName: ComponentsName): ComponentsName {
    const components: any = {
      ConfirmDialogComponent,
      FilterListComponent,
    };
    return components[componentName];
  }
}

export type ComponentsName =
  | 'ConfirmDialogComponent'
  | 'FilterListComponent'
  | string;
