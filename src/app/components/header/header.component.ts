import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() authStatus: boolean = false;
  constructor(private authService: AuthenticationService){}

  ngOnInit(): void {
  }

  public logoutUser() {
    this.authService.logoutUser();
  }
}
