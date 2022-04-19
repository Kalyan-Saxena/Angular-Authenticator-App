import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private AuthService: AuthenticationService) { }

  ngOnInit(): void {
  }

  loginUser(form: NgForm) {
    const userLoginDetails = {
      email: form.value.email,
      password: form.value.password
    }
    this.AuthService.loginUser(userLoginDetails);
  }

}
