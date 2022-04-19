import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Angular-Authenticator';
  public isAuthenticated: boolean = false;
  public subscription: Subscription = new Subscription;
  constructor(private authService: AuthenticationService){}

  ngOnInit() {
    this.authService.autoAuth();
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.subscription = this.authService.getTokenListner().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    })
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
