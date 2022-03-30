import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormsVarsService {
  formInstances: any = [];

  constructor() {}

  public setAllInstances(instance) {
    this.formInstances = instance;
  }

  public set(instance) {
    this.formInstances.push(instance);
  }

  public clear() {
    this.formInstances = [];
  }

  public get() {
    return this.formInstances || [];
  }
}
