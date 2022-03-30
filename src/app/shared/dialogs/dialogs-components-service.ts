import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogComponentNameService {
  constructor() {}

  public getComponent(componentName: ComponentsName): ComponentsName {
    const components: any = {};
    return components[componentName];
  }
}

export type ComponentsName =
  | ''
  | string;
