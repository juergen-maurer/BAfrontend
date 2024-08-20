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


  addToCart(productId: number, quantity: number, warenkorbId:number | null): Observable<any> {

    // Fügen Sie productId als Query-Parameter hinzu
    const params = new HttpParams()
      .set('productId', productId.toString()).set('quantity', quantity.toString())
      .set('cartId', warenkorbId || 0);
    return this.http.post(this.baseUrl + '/add', {}, {params});
  }

  // src/app/services/cart.service.ts
  getCartDetails(warenkorbId: number | null): Observable<CartResponse> {
    const params = new HttpParams().set('cartId', warenkorbId || 0);
    return this.http.get<CartResponse>(this.baseUrl + '/get', { params });
  }


  clearCart(warenkorbId: number | null): void {
    const params = new HttpParams().set('cartId', warenkorbId || 0);
    this.http.delete(this.baseUrl + '/clear', {params}).subscribe({
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


  removeFromCart(productId: number, warenkorbId:number|null): void {
    // Entfernen des Produkts aus dem lokalen Warenkorb
    //console.log('Produkt entfernen service:', productId);
    //this.cart = this.cart.filter(product => product.id !== productId);

    const params = new HttpParams().set('cartId', warenkorbId || 0);
    // Optional: Senden einer Anfrage an das Backend, um das Produkt aus dem Warenkorb zu entfernen
    this.http.delete(`${this.baseUrl}/remove/${productId}`, {params}).subscribe({
      next: () => console.log(`Produkt ${productId} wurde erfolgreich entfernt.`),
      error: (error) => console.error('Fehler beim Entfernen des Produkts:', error)
    });
  }

  updateQuantity(productId: number, quantity: number, warenkorbId:number|null): void {
    // Erstellen der HttpParams mit productId und quantity
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString())
      .set('cartId', warenkorbId || 0);
    // Senden der PUT-Anfrage mit den Parametern
    this.http.put(`${this.baseUrl}/update`, {}, { params }).subscribe({
      next: () => console.log(`Produktmenge für Produkt ${productId} erfolgreich auf ${quantity} geändert.`),
      error: (error) => console.error('Fehler beim Ändern der Produktmenge:', error)
    });
  }
}
