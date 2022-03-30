import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { AppComfirmComponent } from './app-confirm.component';

interface ConfirmData {
  title?: string;
  message?: string;
}

@Injectable()
export class AppConfirmService {

  constructor(private dialog: MatDialog) {
  }

  public confirm(data: ConfirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirmar';
    data.message = data.message || 'Você tem certeza?';
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      width: '380px',
      disableClose: true,
      data: { title: data.title, message: data.message }
    });
    return dialogRef.afterClosed();
  }
}
