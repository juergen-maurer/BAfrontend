// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../User";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  register(user: User): Observable<{ kundenId: string, firstName: string, lastName: string,email:string, warenkorbId: string }> {
    return this.http.post<{ kundenId: string, firstName: string, lastName: string,email:string, warenkorbId:string }>(`${this.apiUrl}/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }

  login(credentials: { email: string, password: string }): Observable<{ kundenId: string, firstName: string, lastName: string, email:string, warenkorbId: string }> {
    return this.http.post<{ kundenId: string, firstName: string, lastName: string, email:string, warenkorbId:string }>(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }
  getProfile(id: number | null): Observable<User> {
    const params = new HttpParams().set('id',  id || 0);
    return this.http.get<User>(this.apiUrl +'/profile', {params});
  }

  updateProfile(user: User, password: String): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile/{kunde}`, {user,password}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  changePassword(kundenId: number | null, oldPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/change-password/${kundenId}`, { oldPassword, newPassword }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('warenkorbId');
  }
}
