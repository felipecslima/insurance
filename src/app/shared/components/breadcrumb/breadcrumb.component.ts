import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RoutePartsService } from '../../../shared/services/route-parts.service';
import { LayoutService } from '../../../shared/services/layout.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  routeParts: any[];
  routerEventSub: Subscription;

  // public isEnabled: boolean = true;
  constructor(
    private router: Router,
    private routePartsService: RoutePartsService,
    private activeRoute: ActivatedRoute,
    public layout: LayoutService,
    private urlService: UrlService,
  ) {
    this.urlService.setBasePath(activeRoute);
    console.log(this.urlService.basePath);

    this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
    console.log(this.routeParts);
    this.routerEventSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
        // generate url from parts ${ this.urlService.basePath }/
        this.routeParts.reverse().map((item, i) => {
          item.breadcrumb = this.parseText(item);
          item.urlSegments.forEach((urlSegment, j) => {
            if (j === 0) {
              return (item.url = `${ urlSegment.path }`);
            }
            item.url += `/${ urlSegment.path }`;
          });
          if (i === 0) {
            item.url = `${ this.urlService.basePath }/${item.url}`;
            return item;
          }
          // prepend previous part to current part
          item.url = `${ this.routeParts[i - 1].url }/${ item.url }`;
          return item;
        });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe();
    }
  }

  parseText(part) {
    if (!part.breadcrumb) {
      return '';
    }
    part.breadcrumb = part.breadcrumb.replace(/{{([^{}]*)}}/g, (a, b) => {
      const r = part.params[b];
      return typeof r === 'string' ? r : a;
    });
    return part.breadcrumb;
  }
}
