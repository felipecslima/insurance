import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DialogsActionService } from '../../dialogs/dialogs-actions-service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-confirm',
  template: `
    <div clCard *ngIf="data?.title">
      <h2 clCardTitle>{{ data.title }}</h2>
      <p clCardSubTitle [innerHTML]="data.message"></p>
      <div clCardFooterButton [disableTop]="true">
        <button (click)="dialogsActionService.close(true)"
                *ngIf="data.buttonConfirm.show"
                clButtonContained
                [bgColor]="colors.primary">
          <span>{{ data.buttonConfirm.label }}</span>
        </button>
        <button (click)="dialogsActionService.close(false)"
                *ngIf="data.buttonCancel.show"
                clButtonContainedSecondary>
          <span>{{ data.buttonCancel.label }}</span>
        </button>
      </div>
    </div>`,
})
export class ConfirmDialogComponent {
  colors = environment.color;
  data: DataConfirm;

  constructor(
    public dialogsActionService: DialogsActionService,
  ) {
    dialogsActionService.getData()
      .pipe(take(1))
      .subscribe((data: any) => {
        const nData: any = JSON.parse(JSON.stringify(data));
        if (!nData.buttonCancel) {
          nData.buttonCancel = {
            show: true,
            label: 'Cancelar'
          };
        }
        if (!nData.buttonConfirm) {
          nData.buttonConfirm = {
            show: true,
            label: 'Ok, entendi!'
          };
        }
        this.data = nData;
      });

  }
}

export interface DataConfirm {
  title: string;
  message?: string;
  buttonConfirm?: {
    show: boolean;
    label: string;
  };
  buttonCancel?: {
    show: boolean;
    label: string;
  };
}
