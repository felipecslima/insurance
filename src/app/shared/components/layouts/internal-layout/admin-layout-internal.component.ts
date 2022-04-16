import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationEnd,
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { LayoutService } from '../../../services/layout.service';
import { filter } from 'rxjs/operators';
import { JwtAuthService } from '../../../services/auth/jwt-auth.service';

@Component({
  selector: 'app-admin-internal-layout',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AdminLayoutInternalComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }


}
