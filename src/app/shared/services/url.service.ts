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

  public getBusinessNotificationList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
      'notificacao',
    ].join('/');
  }

  public getBusinessSafeList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
      'seguros',
    ].join('/');
  }

  public getBusinessSafeSetup(id: unknown = '', typeList?: ChildPersonList['type']): string {
    return [
      this.getBusinessSafeList(typeList),
      'setup',
      id,
    ].join('/');
  }


  public getBusinessPlanList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
      'planos',
    ].join('/');
  }

  public getBusinessPlanSetup(id: unknown = '', typeList?: ChildPersonList['type']): string {
    return [
      this.getBusinessPlanList(typeList),
      'setup',
      id,
    ].join('/');
  }


  public getBusinessServiceList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
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

  public getBusinessServiceLink(typeList: ChildPersonList['type']): string {
    return [
      this.getBusinessServiceList(typeList),
      'meus-servicos',
    ].join('/');
  }

  public getBusinessServiceLinkSetup(id: unknown = '', typeList?: ChildPersonList['type']): string {
    return [
      this.getBusinessServiceList(typeList),
      'setup-link',
      id,
    ].join('/');
  }

  public getBusinessListDoctor(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
      'medicos',
    ].join('/');
  }

  public getBusinessListDoctorSetup(typeList: ChildPersonList['type']): string {
    return [
      this.getBusinessListDoctor(typeList),
      'setup',
    ].join('/');
  }

  public getBusinessList(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
      'clinica',
    ].join('/');
  }

  public getBusinessListSelect(typeList: ChildPersonList['type']): string {
    return [
      this.getBasePath(typeList),
      'clinica',
      'lista',
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
