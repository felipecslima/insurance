import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtAuthService } from './auth/jwt-auth.service';
import { Permission } from '../interfaces/person.interface';

interface IMenuItem {
  type: 'link' | 'dropDown' | 'icon' | 'separator' | 'extLink'; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  svgIcon?: string; // UI Lib icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}

interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;  // Material icon name
  svgIcon?: string; // UI Lib icon name
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>({} as any);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  constructor(private jwtAuthService: JwtAuthService) {
  }

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different persons type.
  publishNavigationChange(typePermission: string) {
    const permission = this.jwtAuthService.getPermission(typePermission);
    const menuCommon = [
      ...this.getMenuByType(permission),
      ...this.getCommonMenu(permission?.paramType),
    ];
    this.menuItems.next(menuCommon);
  }

  private getCommonMenu(paramType: string): IMenuItem[] {
    return [
      {
        name: 'Perfil',
        type: 'link',
        icon: 'person',
        state: `${ paramType }/usuario/perfil`,
      }
    ];
  }

  getMenuByType(permission: Permission): IMenuItem[] {
    if (permission.id === 1) { // Coop Menu
      return this._createMenuCoop(permission.paramType);
    }
    return [];
  }

  _createMenuCoop(paramType: string): IMenuItem[] {
    return [
      {
        name: 'Usuários',
        type: 'dropDown',
        icon: 'person',
        sub: [
          {
            name: 'Cooperativa',
            type: 'link',
            icon: 'person',
            state: `${ paramType }/usuario/cooperativa`,
          },
          {
            name: 'Consultores',
            type: 'link',
            icon: 'person',
            state: `${ paramType }/usuario/consultor`,
          },
          {
            name: 'Clinica',
            type: 'link',
            icon: 'person',
            state: `${ paramType }/usuario/clinica`,
          }
        ]
      },
    ];
  }


}
