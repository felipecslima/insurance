import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtAuthService } from '../services/auth/jwt-auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private AUTH_HEADER = 'Authorization';
  private token: string | undefined;
  private refreshTokenSubject = new Subject<any>();
  private authService: any;

  constructor(private inj: Injector, private router: Router) {
    this.refreshTokenSubject.next(null);
    this.authService = this.inj.get(JwtAuthService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = this.addAuthenticationToken(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.urlWithParams.includes('token=test')) {
          return throwError(error);
        }

        if (error && (error.status === 401)) {
          // 401 errors are most likely going to be because we have an expired token that we need to refresh.
          this.authService.signout(this.router.url);
        }
        const { error: err } = error;
        if (err) {
          return throwError(err);
        }

        return throwError(error);
      }),
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    const authService = this.inj.get(JwtAuthService);
    this.token = authService.getJwtToken();

    if (!this.token) {
      return request;
    }

    let excludeTokenInterceptor;
    if (request.url.indexOf('login') > 0) {
      excludeTokenInterceptor = true;
    } else {
      excludeTokenInterceptor = request.url.indexOf('svg') > 0;
    }

    if (excludeTokenInterceptor) {
      return request;
    }

    // If you are calling an outside domain then do not add the token.
    if (request.url.indexOf('34.74') > -1) {
      return request;
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + this.token),
    });
  }
}
