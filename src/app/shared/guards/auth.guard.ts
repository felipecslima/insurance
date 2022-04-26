import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { JwtAuthService } from '../services/auth/jwt-auth.service';
import { Permission } from '../interfaces/person.interface';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private jwtAuth: JwtAuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const action = this.listPermissionByPath(route);
    if (action === 'PAGE') {
      return true;
    } else if (action === 'LOGIN') {
      this.router.navigate(['/sessions/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
    this.router.navigate(['/sessions/404']);
    return false;
  }

  listPermissionByPath(route: ActivatedRouteSnapshot): 'LOGIN' | 'NOT_FOUND' | 'PAGE' {
    const [urlSegment] = route.url;
    const permissionType = urlSegment.path as Permission['paramType'];
    if (this.getPermissionByUser().includes(permissionType)) {
      return 'PAGE';
    }

    if (!this.jwtAuth.isLoggedIn()) {
      return 'LOGIN';
    }

    return 'NOT_FOUND';
  }


  getPermissionByUser() {
    const { user } = this.jwtAuth.getUser();
    const usersActive = user.filter(u => u.active);
    return usersActive.map(u => {
      return this.jwtAuth.getPermissionById(u.personTypeId).paramType;
    });
  }
}
