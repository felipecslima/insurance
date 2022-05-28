import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { formsReducers } from './state/form.reducers';
import { initialState } from './state/form.state';
import { FormComponent } from './component/form/form.component';
import { CollactComponentsModule } from 'collact-components';
import { CollactDesignSystemModule } from 'collact-design-system';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [FormComponent],
  imports: [
    HttpClientModule,
    CollactComponentsModule,
    CollactDesignSystemModule,
    CommonModule,
    StoreModule.forFeature('forms', formsReducers, { initialState }),
  ],
  exports: [FormComponent],
})
export class ClFormsModule {
}
