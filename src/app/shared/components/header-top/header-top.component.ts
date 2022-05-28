import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html'
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  layoutConf: any;
  menuItems: any;
  menuItemSub: Subscription;
  egretThemes: any[] = [];
  @Input() notificPanel;

  constructor(
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public jwtAuth: JwtAuthService
  ) {
  }

  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;
    this.egretThemes = this.themeService.egretThemes;
    this.menuItemSub = this.navService.menuItems$
      .pipe(
        filter(res => !!res && res.length > 0)
      )
      .subscribe(res => {
        res = res?.filter(item => item.type !== 'icon' && item.type !== 'separator');
        const limit = 4;
        const mainItems: any[] = res.slice(0, limit);
        if (res.length <= limit) {
          return this.menuItems = mainItems;
        }
        const subItems: any[] = res.slice(limit, res.length - 1);
        mainItems.push({
          name: 'More',
          type: 'dropDown',
          tooltip: 'More',
          icon: 'more_horiz',
          sub: subItems
        });
        this.menuItems = mainItems;
      });
  }

  ngOnDestroy() {
    this.menuItemSub.unsubscribe();
  }

  changeTheme(theme) {
    this.layout.publishLayoutChange({ matTheme: theme.name });
  }

  toggleNotific() {
    this.notificPanel.toggle();
  }

  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }
}
