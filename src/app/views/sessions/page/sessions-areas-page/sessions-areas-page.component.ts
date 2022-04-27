import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { UrlService } from '../../../../shared/services/url.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-pricing',
  templateUrl: './sessions-areas-page.component.html',
  styleUrls: ['./sessions-areas-page.component.scss']
})
@AutoUnsubscribe()
export class SessionsAreasPageComponent implements OnInit, OnDestroy {
  permissionsList = [];

  constructor(
    private jwtAuthService: JwtAuthService,
    private urlService: UrlService,
  ) {
    this.permissionsList = [];
    this.jwtAuthService.checkTokenIsValid().pipe(
      tap(() => {
        this.permissionsList = this.getListPermission().filter(pl => {
          return !!this.jwtAuthService.getPermissions().find(pu => pu.paramType === pl.paramType);
        });
      })
    )
      .subscribe();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  getListPermission() {
    return [
      {
        name: 'Área da Cooperativa',
        url: this.urlService.getUserList('cooperativa', 'cooperativa'),
        paramType: 'cooperativa',
      },
      {
        name: 'Área da Clinica',
        url: this.urlService.getUserList('medico', 'clinica'),
        paramType: 'clinica',
      },
      {
        name: 'Área do Consultor',
        url: this.urlService.getUserList('consultor', 'consultor'),
        paramType: 'consultor',
      }
    ];
  }

}
