import { Observable, Subject } from 'rxjs';
import { FormsService } from './forms.service';
import { Injectable } from '@angular/core';
import { FormsVarsService } from './forms-vars.service';
import { FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormConfigBaseService {
  public formValues: any = {};

  /**
   * The pre populate subject used to notify when pre populate data is present at component
   */
  public prePopulateSubject = new Subject();

  public updateForm = new Subject<boolean>();

  constructor(
    public formsService: FormsService,
    public formVarService: FormsVarsService,
  ) {
    this.formsService.getValues().subscribe(values => {
      this.formValues = values;
    });
  }

  getValues(): Observable<any> {
    return this.formsService.getValues();
  }

  getUpdateForms(): Observable<boolean> {
    return this.updateForm.asObservable();
  }

  /**
   * Checks for default values for the form
   * @param defaultValues
   */
  checkDefaultValue(defaultValues: any): void {
    if (defaultValues) {
      let values = {};
      Object.keys(defaultValues).forEach(index => {
        const value = {
          [defaultValues[index].key]: defaultValues[index].value,
        };
        values = Object.assign({}, values, value);
      });
      this.prePopulateSubject.next(values);
    }
  }

  /**
   * Set setValue to Form State
   */
  public setValue(objValue: any): void {
    this.formsService.changeFormValues(objValue);
  }

  /**
   * Reset form completely
   * Used to clear all form
   */
  public resetAllForms(): void {
    this.clearFormInstances();
    this.formsService.resetForm();
  }

  /**
   * Inset values from object to state
   * This object can be formatted
   * @param values - Object
   */
  public changeFormValues(values: any = {}): void {
    this.formsService.changeFormValues(values);
  }

  /**
   * Init form and populate
   * This object can be formatted
   * @param objetToPopulate;
   */
  public initForm(objetToPopulate?: any): void {
    this.formsService.settingForm({ name: 'formValues' });
    this.formsService.resetForm();
    this.setValue(objetToPopulate);
    this.populateForm(objetToPopulate);
  }

  /**
   * Populate form instances
   */
  public populateForm(obj = {}, force = false): void {
    Object.keys(obj).forEach(key => {
      this._getFormInstance().forEach(formInstance => {
        const formControl = formInstance?.form?.controls[key];
        if (formControl) {
          if (force && formControl) {
            formControl.setValue(obj[key]);
          } else if (!formControl.value && obj[key]) {
            formControl.setValue(obj[key]);
          }
        }
      });
    });
  }

  /**
   * Clear all forms instances into the service
   * @param formsInstance used to clear a determinate form
   */
  public clearFormInstances(formsInstance?: any): void {
    if (formsInstance) {
      const { fields } = formsInstance;
      const [field] = fields;
      const formsInstances = this.formVarService.get().filter(f => {
        const { fields } = f;
        const fieldName = fields.map(field => field.name);
        return !fieldName.includes(field.name);
      });
      this.formVarService.setAllInstances(formsInstances);
      this.updateForm.next(true);
      return;
    }
    this.updateForm.next(true);
    this.formVarService.clear();
  }

  /**
   * Get an array form instances
   */
  private _getFormInstance(): any[] {
    if (this.formVarService.get() && this.formVarService.get().length) {
      return this.formVarService.get();
    }
    return [];
  }

  public setValueControl(controlName: string, value: any): void {
    this.setValue({ [controlName]: value });
    this.populateForm({ [controlName]: value }, true);
  }

  /**
   * Set value to control
   * @param name - requires
   * @param value - requires
   */
  public setValueForm(name: string, value: any): void {
    this._getFormInstance().forEach(formInstance => {
      const formControl = formInstance?.form?.controls[name];
      if (formControl) {
        formControl.setValue(value);
        const setToValues = {};
        setToValues[name] = value;
        this.setValue(setToValues);
      }
    });
  }

  /**
   * Remove control to any form created
   * @param name - requires name to delete control
   */
  public removeControl(name: string): void {
    this._getFormInstance().forEach(formInstance => {
      const formControl = formInstance?.form?.controls[name];
      if (formControl) {
        const formInstanceFind = formInstance.form;
        formInstanceFind.removeControl(name);
      }
    });
  }

  /**
   * Add a new control to any form created
   * @param config - requires name, value and or validation required
   */
  public setNewControl(config: {
    name: string;
    value?: any;
    required?: boolean;
  }): void {
    const { name, value, required } = config;
    let countIntervalLoop = 0;
    const intervalVar = setInterval(() => {
      const [formInstances] = this._getFormInstance();
      if (formInstances) {
        clearInterval(intervalVar);
        const formInstance = formInstances.form;
        formInstance.addControl(
          name,
          new FormControl(value, required ? Validators.required : null),
        );
      }
      if (countIntervalLoop >= 3) {
        clearInterval(intervalVar);
      }
      countIntervalLoop++;
    }, 100);
  }

  /**
   * Set a form instance into the service
   */
  public setFormInstance(formInstance: any): void {
    this.formVarService.set(formInstance);
    this.updateForm.next(true);
    setTimeout(() => {
      this.populateForm(this.formValues);
    }, 0);
  }

  /**
   * Check if all forms set are valid
   */
  public isAllFormsValid(): boolean {
    if (this._getFormInstance().length === 0) {
      return false;
    }

    const formInstancesValid = this._getFormInstance().filter(formComponent => {
      return formComponent.form.status !== 'INVALID';
    });

    return this._getFormInstance().length === formInstancesValid.length;
  }

  /**
   * Force all forms to validate their fields
   */
  public validateAllForms(): void {
    this._getFormInstance().forEach(formComponent => {
      formComponent.validateAllFormFields(formComponent.form);
    });
  }
}
