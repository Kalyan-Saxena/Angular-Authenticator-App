import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isAuthenticated: boolean = false;

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authService.getTokenListner().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    })
    return this.isAuthenticated;
  }

}
