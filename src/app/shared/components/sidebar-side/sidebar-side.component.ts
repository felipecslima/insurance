import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { ILayoutConf, LayoutService } from 'app/shared/services/layout.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar-side',
  templateUrl: './sidebar-side.component.html'
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;

  constructor(
    private route: ActivatedRoute,
    private navService: NavigationService,
    private layout: LayoutService,
  ) {
    const typePermission = route.snapshot.paramMap.get('type');
    this.navService.publishNavigationChange(typePermission);
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem.map((mi: any) => {
        if (mi.type === 'link') {
          mi.state = `/${ mi.state }`;
          return mi;
        }
        return mi;
      });

      // Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === 'icon'
      ).length;
    });
  }

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.layoutConf = this.layout.layoutConf;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }

  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
      this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
      this.layout.publishLayoutChange({
        // sidebarStyle: "compact",
        sidebarCompactToggle: true
      });
    }
  }
}
