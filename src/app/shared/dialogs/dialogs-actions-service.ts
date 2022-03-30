import { Injectable, Injector } from '@angular/core';
import { DialogService } from './dialogs-service';
import { Observable } from 'rxjs';
import { DialogStateModel } from './state/dialog.state.model';

@Injectable({
  providedIn: 'root',
})
export class DialogsActionService {
  constructor(private inj: Injector) {}

  public open(
    config: DialogStateModel['config'],
    component: DialogStateModel['component'],
    data?: DialogStateModel['data'],
  ): void {
    const componentNameService = this.inj.get(DialogService);
    componentNameService.open(config, component, data);
  }

  public dialogClose(): Observable<DialogStateModel> {
    const componentNameService = this.inj.get(DialogService);
    return componentNameService.dialogClose();
  }

  public close(data?): void {
    const componentNameService = this.inj.get(DialogService);
    componentNameService.close(data);
  }

  public getData(): Observable<DialogStateModel['data']> {
    const componentNameService = this.inj.get(DialogService);
    return componentNameService.getData();
  }
}
