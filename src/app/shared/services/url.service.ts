import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterParamsService } from './router-params.service';
import { noop } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { ChildPersonList } from '../../views/persons/persons.routing';

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

  public getUserList(typeList: ChildPersonList['type'], typeBase?: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeBase),
      'usuario',
      typeList
    ].join('/');
  }

  public getUserPreSetup(typeList: ChildPersonList['type']): string {
    return [
      this.getUserList(typeList),
      'pre-setup',
    ].join('/');
  }

  public getUserSetup(id: unknown = '', typeList: ChildPersonList['type']): string {
    return [
      this.getUserList(typeList),
      'setup',
      id
    ].join('/');
  }

  public getUserProfile(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'usuario',
      'perfil',
    ].join('/');
  }

  private getBasePath(type: ChildPersonList['type']): string {
    return type ? `/${ type }` : `/${ this.basePath }`;
  }

}
