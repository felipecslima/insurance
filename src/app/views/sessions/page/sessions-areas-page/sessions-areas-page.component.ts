import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { UrlService } from '../../../../shared/services/url.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './sessions-areas-page.component.html',
  styleUrls: ['./sessions-areas-page.component.scss']
})
@AutoUnsubscribe()
export class SessionsAreasPageComponent implements OnInit, OnDestroy {

  permissionsList = [
    {
      name: 'Área da Cooperativa',
      url: this.urlService.getUserList('cooperativa', 'cooperativa')
    },
    {
      name: 'Área da Clinica',
      url: this.urlService.getUserList('medico', 'clinica')
    }
  ];

  constructor(
    private urlService: UrlService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
