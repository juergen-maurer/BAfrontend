// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../User';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  isRegistering: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private appComponent: AppComponent) {}

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
  }

  onSubmit(): void {
    if (this.isRegistering) {
      const newUser: User = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      };
      this.authService.register(newUser).subscribe(
        response => {
          localStorage.setItem('kundenId', response.kundenId);
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('email', response.email);
          localStorage.setItem('warenkorbId', response.warenkorbId);
          this.appComponent.updateUserDetails();
          this.router.navigate(['/']);
        },
        error => {
          if (error.status === 409) {
            this.errorMessage = 'Email address already in use';
          } else {
            this.errorMessage = 'An error occurred during registration';
          }
        }
      );
    } else {
      const credentials = { email: this.email, password: this.password };
      this.authService.login(credentials).subscribe(
        response => {
          localStorage.setItem('kundenId', response.kundenId);
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('email', response.email);
          localStorage.setItem('warenkorbId', response.warenkorbId);
          this.appComponent.updateUserDetails();
          this.router.navigate(['/']);
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'An error occurred during registration';
          }
        }
      );
    }
  }

}
