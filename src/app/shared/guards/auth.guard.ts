import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { JwtAuthService } from '../services/auth/jwt-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private jwtAuth: JwtAuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const type = this.jwtAuth.getPermission(route.params.type);

    if (this.jwtAuth.isLoggedIn() && type) {
      return true;
    } else {
      if (!type) {
        this.router.navigate(['/sessions/404']);
      } else {
        this.router.navigate(['/sessions/login'], {
          queryParams: {
            return: state.url
          }
        });
      }

      return false;
    }
  }
}
