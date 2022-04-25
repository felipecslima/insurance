import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe, CombineSubscriptions } from '../../decorators/auto-unsubscribe.decorator';
import { environment } from '../../../../environments/environment';
import { Unsubscribable } from 'rxjs';
import { Router } from '@angular/router';
import { DialogsActionService } from '../../dialogs/dialogs-actions-service';
import { FormConfigBaseService } from '../../forms/services/form-config-base.service';

@Component({
  selector: 'filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
@AutoUnsubscribe()
export class FilterListComponent implements OnInit, OnDestroy {
  colors = environment.color;
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  formConfig: any;
  values: any;

  constructor(
    private formConfigBaseService: FormConfigBaseService,
    private router: Router,
    private dialogsActionService: DialogsActionService,
  ) {
    this.subscribers = formConfigBaseService.getValues().subscribe(values => {
      this.values = values;
    });

    this.subscribers = dialogsActionService.getData().subscribe(formConfig => {
      this.formConfig = formConfig;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  filter() {
    const queryParams: any = {};
    Object.keys(this.values).forEach(value => {
      if (this.values[value]) {
        queryParams[value] = this.values[value];
      } else {
        queryParams[value] = undefined;
      }
    });


    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge'
    });
    this.close();
  }

  close(clearFilters = false) {
    if (clearFilters) {
      this.router.navigate([]);
    }
    this.dialogsActionService.close();
  }
}
