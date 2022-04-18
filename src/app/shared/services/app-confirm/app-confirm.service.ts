import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { DataConfirm } from './app-confirm.component';
import { DialogService } from '../../dialogs/dialogs-service';

@Injectable()
export class AppConfirmService {

  constructor(
    private dialogService: DialogService) {
  }

  public confirm(data: DataConfirm): Observable<any> {
    data.title = data.title || 'Confirmar';
    data.message = data.message || 'Você tem certeza?';
    this.dialogService.open('REGULAR', 'ConfirmDialogComponent', data);
    return this.dialogService.dialogClose();
  }
}
