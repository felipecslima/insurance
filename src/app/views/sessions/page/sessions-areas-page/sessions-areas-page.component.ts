import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { UrlService } from '../../../../shared/services/url.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-pricing',
  templateUrl: './sessions-areas-page.component.html',
  styleUrls: ['./sessions-areas-page.component.scss']
})
@AutoUnsubscribe()
export class SessionsAreasPageComponent implements OnInit, OnDestroy, AfterViewInit {
  permissionsList = [];
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  constructor(
    private router: Router,
    private jwtAuthService: JwtAuthService,
    private urlService: UrlService,
  ) {
    this.permissionsList = [];
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.progressBar.mode = 'indeterminate';
    this.jwtAuthService.checkTokenIsValid().pipe(
      tap(() => {
        this.progressBar.mode = 'determinate';
        this.permissionsList = this.getListPermission().filter(pl => {
          return !!this.jwtAuthService.getPermissions().find(pu => pu.paramType === pl.paramType);
        });
        if (this.permissionsList.length === 1) {
          const [permission] = this.permissionsList;
          this.router.navigate([permission.url]);
        }
      })
    )
      .subscribe();
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
        url: this.urlService.getBusinessListSelect('clinica'),
        paramType: 'clinica',
      },
      {
        name: 'Área do Consultor',
        url: this.urlService.getUserList('consultor', 'consultor'),
        paramType: 'consultor',
      },
      {
        name: 'Área do médico',
        url: this.urlService.getBusinessListSelect('medico'),
        paramType: 'medico',
      }
    ];
  }

}
