// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/order'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  submitOrder(orderDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderDetails);
  }
}
