import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { JwtAuthService } from '../../services/auth/jwt-auth.service';
import { User } from 'app/shared/models/user.model';
import { UrlService } from '../../services/url.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { noop, Unsubscribable } from 'rxjs';
import { CombineSubscriptions } from '../../decorators/auto-unsubscribe.decorator';
import { ChildPersonList } from '../../../views/persons/persons.routing';
import { Permission, Person } from '../../interfaces/person.interface';

@Component({
  selector: 'app-header-side',
  styles: ['.hello{font-size: 14px}'],
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit, OnDestroy {
  @CombineSubscriptions()
  subscribers: Unsubscribable;

  @Input() notificPanel;

  public egretThemes;
  public layoutConf: any;
  public user: Person;

  urlUserProfile: string;
  typePerson: string;
  permission: Permission;

  constructor(
    private route: ActivatedRoute,
    private urlService: UrlService,
    private themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService
  ) {
    this.urlService.setBasePath(route);
    this.typePerson = this.urlService.getParamType(route);
    this.urlUserProfile = this.urlService.getUserProfile(this.typePerson);
    this.permission = this.jwtAuth.getPermission(this.typePerson);
  }

  ngOnInit() {
    this.user = this.jwtAuth.getUser();
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
  }

  ngOnDestroy(): void {
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
  }
}
