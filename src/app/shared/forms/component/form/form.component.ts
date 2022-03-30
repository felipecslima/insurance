import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ClFieldConfig, ClForm } from 'collact-components';
import { FormConfigBaseService } from '../../services/form-config-base.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cl-form-component',
  templateUrl: './form.component.html',
})
export class FormComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() formConfig: any;
  @Input() clearValuesOnDestroy: boolean;
  @Input() formAlign = {
    layout: 'column',
    gap: '32px',
    align: 'start none',
    fxFlex: 'fill',
  };
  @Input() formAlignXs = {
    layout: 'column',
    gap: '32px',
    align: 'start none',
    fxFlex: 'fill',
  };

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() changes: EventEmitter<any> = new EventEmitter<any>();
  @Output() isValid: EventEmitter<any> = new EventEmitter<any>();
  @Output() formInstance: EventEmitter<any> = new EventEmitter<any>();

  isFormValid: boolean;
  formInstanceLocal: any;

  @ViewChild(ClForm, { static: false }) form: ClForm;

  regConfig: ClFieldConfig[];

  unsubscribe: any[] = [];

  constructor(private formConfigBaseService: FormConfigBaseService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formConfig) {
      this.setConfig();
    }
  }

  ngOnInit() {
    this.setConfig();
  }

  setConfig() {
    this.setObservable();
  }

  ngAfterViewInit(): void {
    this.isFormValid = this.form.form.valid;
    this.isValid.emit(this.isFormValid);
    this.formInstance.emit(this.form);
    this.formInstanceLocal = this.form;
    this.formInstanceLocal = this.form;
    this.formConfigBaseService.setFormInstance(this.form);
    const formChangesSubscribe = this.form.form.valueChanges.subscribe(data => {
      this.isFormValid = this.form.form.valid;
      this.isValid.emit(this.isFormValid);
      this.sendChanges(data);
    });
    this.unsubscribe.push(formChangesSubscribe);
  }

  setObservable() {
    this.removeObservable();
    this.regConfig = null;
    this.regConfig = this.formConfig;
  }

  removeObservable() {
    this.unsubscribe.map(s => {
      s.complete();
      s.unsubscribe();
    });
    this.unsubscribe = [];
  }

  validateAllFields() {
    this.form.validateAllFormFields(this.form.form);
  }

  ngOnDestroy(): void {
    const removeValues: any = {};
    if (this.clearValuesOnDestroy) {
      this.formConfig.forEach(fc => {
        removeValues[fc.name] = undefined;
      });
      this.formConfigBaseService.setValue(removeValues);
    }
    this.formConfigBaseService.clearFormInstances(this.form);
    this.removeObservable();
  }

  sendChanges(data) {
    this.formConfigBaseService.changeFormValues(data);
    this.changes.emit(data);
  }

  submitForm() {
    this.submit.emit(this.form.form);
  }
}
