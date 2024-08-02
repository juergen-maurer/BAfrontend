// src/app/services/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firstName: string | null = null;

  setFirstName(firstName: string): void {
    this.firstName = firstName;
    localStorage.setItem('firstName', firstName);
  }

  getFirstName(): string | null {
    if (!this.firstName) {
      this.firstName = localStorage.getItem('firstName');
    }
    return this.firstName;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
