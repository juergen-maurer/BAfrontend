// src/app/cart.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../product";
import {CartResponse} from "../CartResponse";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Product[] = [];
  private baseUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    // Fügen Sie productId als Query-Parameter hinzu
    const params = new HttpParams().set('productId', productId.toString()).set('quantity', quantity.toString());
    return this.http.post(this.baseUrl + '/add', {}, {params});
  }

  getCartDetails(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl + '/get');
  }

  getCart(): Product[] {
    return this.cart;
  }

  clearCart(): void {
    this.http.delete(this.baseUrl + '/clear').subscribe({
      next: () => {
        // Erfolgreiches Löschen des Warenkorbs im Backend
        this.cart = []; // Lokalen Warenkorb leeren
        console.log('Warenkorb erfolgreich gelöscht');
      },
      error: (error) => {
        // Fehlerbehandlung
        console.error('Fehler beim Löschen des Warenkorbs:', error);
      }
    });
  }

  increaseQuantity(productId: number): void {
    // Logik zum Erhöhen der Produktmenge
  }

  decreaseQuantity(productId: number): void {
    // Logik zum Verringern der Produktmenge, aber nicht unter 1
  }

  removeFromCart(productId: number): void {
    // Entfernen des Produkts aus dem lokalen Warenkorb
    //console.log('Produkt entfernen service:', productId);
    //this.cart = this.cart.filter(product => product.id !== productId);


    // Optional: Senden einer Anfrage an das Backend, um das Produkt aus dem Warenkorb zu entfernen
    this.http.delete(`${this.baseUrl}/remove/${productId}`).subscribe({
      next: () => console.log(`Produkt ${productId} wurde erfolgreich entfernt.`),
      error: (error) => console.error('Fehler beim Entfernen des Produkts:', error)
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    // Erstellen der HttpParams mit productId und quantity
    const params = new HttpParams().set('productId', productId.toString()).set('quantity', quantity.toString());

    // Senden der PUT-Anfrage mit den Parametern
    this.http.put(`${this.baseUrl}/update`, {}, { params }).subscribe({
      next: () => console.log(`Produktmenge für Produkt ${productId} erfolgreich auf ${quantity} geändert.`),
      error: (error) => console.error('Fehler beim Ändern der Produktmenge:', error)
    });
  }
}
