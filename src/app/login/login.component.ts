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
          localStorage.setItem('token', response.token);
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('warenkorbId', response.warenkorbId);
          this.appComponent.updateUserDetails();
          this.router.navigate(['/']);
        },
        error => console.error('Registration error', error)
      );
    } else {
      const credentials = { email: this.email, password: this.password };
      this.authService.login(credentials).subscribe(
        response => {
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('email', response.email);
          localStorage.setItem('warenkorbId', response.warenkorbId);
          this.appComponent.updateUserDetails();
          this.router.navigate(['/']);
        },
        error => console.error('Login error', error)
      );
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      this.router.navigate(['/login']);
    });
  }
}
