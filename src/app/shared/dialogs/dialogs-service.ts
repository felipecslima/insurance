import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { DialogSelectors } from './state/dialog.selector.types';
import { DialogStateModel } from './state/dialog.state.model';
import { DialogActions } from './state/dialog.action.types';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { distinct, filter, skip, take } from 'rxjs/operators';
import { DialogComponentNameService } from './dialogs-components-service';
import { Timeout } from '../decorators/timeout-method.decorator';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private inj: Injector,
    protected store: Store<any>,
    private _dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.getSubscriber();
  }

  @Timeout(300)
  getSubscriber(): void {
    this._getOpen()
      .pipe(
        filter(response => !!response.component),
        distinct(response => response.id),
      )
      .subscribe(dialog => {
        setTimeout(() => {
          const serviceName = DialogComponentNameService;
          const componentNameService = this.inj.get(serviceName);
          const components = componentNameService.getComponent(
            dialog.component,
          );
          const nDialog = Object.assign({}, dialog, { component: components });
          this._setConfig(nDialog);
        }, 300);
      });
  }

  public dialog(): Observable<DialogStateModel> {
    return this.store.pipe(select(DialogSelectors.dialogSelector));
  }

  public dialogClose(): Observable<DialogStateModel> {
    return this.store
      .pipe(select(DialogSelectors.getDataClose))
      .pipe(skip(1), take(1));
  }

  public close(data?): void {
    this._dialog.closeAll();
    this._bottomSheet.dismiss();
    this._close(data);
  }

  public setData(data: DialogStateModel['data']): void {
    this.store.dispatch(DialogActions.setData({ data }));
  }

  public getData(): Observable<DialogStateModel['data']> {
    return this.store.pipe(select(DialogSelectors.getDataSelector));
  }

  public open(
    config: DialogStateModel['config'],
    component: DialogStateModel['component'],
    data?: DialogStateModel['data'],
  ): void {
    this.store.dispatch(DialogActions.openDialog({ config, component }));
    if (data) {
      this.setData(data);
    }
  }

  private _close(dataClose?): void {
    this.store.dispatch(DialogActions.closeDialog({ dataClose }));
  }

  private _getOpen(): Observable<DialogStateModel> {
    return this.store.pipe(select(DialogSelectors.openDialog));
  }

  private _setConfig(dialog: DialogStateModel) {
    const { config, component: componentName } = dialog;
    const component: any = componentName;

    if (config === 'ONLY_BOTTOM_SHEETS') {
      this._setConfigBottomSheets(component);
    }
    if (config === 'ONLY_DIALOG') {
      this._setConfigDialog(component);
    }
    if (config === 'REGULAR') {
      this._setConfigRegular(component);
    }
    if (config === 'FULL_DIALOG') {
      this._setConfigFullDialog(component);
    }
  }

  private _setConfigBottomSheets(component: DialogStateModel['component']) {
    const ref = this._bottomSheet.open(component as any, {
      closeOnNavigation: true,
      panelClass: 'cl-dialog',
    });
    ref.afterDismissed().subscribe(() => this._close());
    this._fixHeightDialog(ref);
  }

  private _setConfigDialog(component: DialogStateModel['component']) {
    const ref = this._dialog.open(component as any, {
      closeOnNavigation: true,
      width: '512px',
      panelClass: 'cl-dialog',
    });
    ref.afterClosed().subscribe(() => this._close());
    this._fixHeightDialog(ref);
  }

  private _setConfigFullDialog(component: DialogStateModel['component']) {
    const ref = this._dialog.open(component as any, {
      closeOnNavigation: true,
      width: '100%',
      height: '100%',
      minWidth: '100%',
      minHeight: '100%',
      panelClass: ['cl-dialog', 'cl-dialog--full'],
    });
    ref.afterClosed().subscribe(() => this._close());
  }

  private _setConfigRegular(component: DialogStateModel['component']) {
    let ref;
    if (window.innerWidth > 600) {
      ref = this._dialog.open(component as any, {
        closeOnNavigation: true,
        width: '512px',
        panelClass: 'cl-dialog',
      });
      ref.afterClosed().subscribe(() => this._close());
    } else {
      ref = this._bottomSheet.open(component as any, {
        closeOnNavigation: true,
        panelClass: 'cl-dialog',
      });
      ref.afterDismissed().subscribe(() => this._close());
    }
    this._fixHeightDialog(ref);
  }

  private _fixHeightDialog(ref) {
    ref
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        if (
          ref._overlayRef._pane.querySelector('.cl-card__footer--button.fixed')
        ) {
          const isBottomSheet =
            ref._overlayRef._pane.querySelector('.cl-dialog');

          if (isBottomSheet) {
            ref._overlayRef._pane
              .querySelector('.cl-dialog')
              ?.classList.add('cl-dialog--has-footer-fixed');
            return;
          }

          ref._overlayRef._pane?.classList.add('cl-dialog--has-footer-fixed');
        }
      });
  }
}
