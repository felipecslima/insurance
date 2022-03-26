import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { JwtAuthService } from '../../services/auth/jwt-auth.service';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;

  public egretThemes;
  public layoutConf: any;
  public user: User;

  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService
  ) {
  }

  ngOnInit() {
    this.user = this.jwtAuth.getUser();
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
  }

  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
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

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, { transitionClass: true });
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, { transitionClass: true });

  }

  onSearch(e) {
    //   console.log(e)
  }
}
