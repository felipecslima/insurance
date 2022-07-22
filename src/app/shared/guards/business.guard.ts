import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BusinessSelectedService } from '../../views/business/business-selected.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable()
export class BusinessGuard implements CanActivate {

  constructor(
    private utilsService: UtilsService,
    private businessSelectedService: BusinessSelectedService,
    private router: Router,
   ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const [, permissionType] = location.pathname.split('/') as any;
    if (permissionType === 'clinica') {
      return this.businessSelectedService.get().pipe(
        map(response => {
          if (!response) {
            this.utilsService.toast('Selecione uma clínica antes de continuar', 'error');
            this.router.navigate(['/clinica/clinica/lista']);
          }
          return !!response;
        })
      );
    }
    return true;
  }
}
