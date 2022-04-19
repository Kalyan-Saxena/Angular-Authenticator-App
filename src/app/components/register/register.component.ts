import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private AuthService: AuthenticationService) { }

  ngOnInit(): void {
  }

  onRegisterUser(form: NgForm) {
    const user = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    }
    this.AuthService.registerUser(user);
  }

}
