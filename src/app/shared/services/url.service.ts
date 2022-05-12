import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChildPersonList } from '../../views/persons/persons.routing';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  basePath: string;

  public setBasePath(route: ActivatedRoute): void {
    this.basePath = this.getParamType(route);
  }

  public getBusinessPlainList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'negocios',
      'planos',
    ].join('/');
  }

  public getBusinessPlainSetup(id: unknown = '', typeList?: ChildPersonList['type']): string {
    return [
      this.getBusinessPlainList(typeList),
      'setup',
      id,
    ].join('/');
  }


  public getBusinessServiceList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'negocios',
      'servicos',
    ].join('/');
  }

  public getBusinessServiceSetup(id: unknown = '', typeList?: ChildPersonList['type']): string {
    return [
      this.getBusinessServiceList(typeList),
      'setup',
      id,
    ].join('/');
  }

  public getBusinessList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'negocios',
      'clinica',
    ].join('/');
  }

  public getBusinessSetup(id: unknown = '', typeList?: ChildPersonList['type']): string {
    return [
      this.getBusinessList(typeList),
      'setup',
      id,
    ].join('/');
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
