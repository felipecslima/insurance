import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterParamsService } from './router-params.service';
import { noop } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  basePath: string;

  public setBasePath(route: ActivatedRoute): void {
    this.basePath = this.getParamType(route);
  }

  getParamType(route: ActivatedRoute) {
    const type = route.snapshot.paramMap.get('type');
    if (type) {
      return type;
    }
    return this.getParamType(route.parent);
  }

  public getUserList(type?: UrlType): string {
    return [
      this.getBasePath(type),
      'usuario'
    ].join('/');
  }

  public getUserSetup(id: unknown = '', type?: UrlType): string {
    return [
      this.getBasePath(type),
      'usuario/setup',
      id
    ].join('/');
  }

  private getBasePath(type: UrlType): string {
    return ['/', type || this.basePath].join('/');
  }

}

export type UrlType = 'cooperativa';
