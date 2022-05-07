import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../../../shared/services/url.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { Permission } from '../../../../shared/interfaces/person.interface';

@Component({
  selector: 'business-setup-page',
  templateUrl: './business-setup-page.component.html',
  styleUrls: ['./business-setup-page.component.scss']
})
export class BusinessSetupPageComponent implements OnInit {

  typePermission: string;
  permissions: Permission;

  constructor(
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private urlService: UrlService,
    private jwtAuthService: JwtAuthService,
  ) {
    this.urlService.setBasePath(route);
    this.typePermission = utilsService.getParamType(route);
    this.permissions = this.jwtAuthService.getPermission(this.typePermission);
    console.log(this.permissions);
  }

  ngOnInit(): void {
  }

}
