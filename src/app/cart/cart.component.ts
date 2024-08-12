// src/app/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';

import { Product } from '../product';
import {CartService} from "../services/cart.service";
import {SearchService} from "../services/search.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Product[] = [];
  notificationMessage: string = '';
  productId: number = 0;
  searchTerm: string = '';
  warenkorbIdStr: string | null = null;
  warenkorbId: number | null = null

  constructor(private cartService: CartService, private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.loadCartDetails();
    this.searchService.getSearchTerm().subscribe(term => {
      this.searchTerm = term;
    });
  }

  // In Ihrer Warenkorb-Komponente
  // Adjust the loadCartDetails method in CartComponent to use the updated getCartDetails method

  loadCartDetails() {
    this.warenkorbIdStr = localStorage.getItem('warenkorbId');
    this.warenkorbId = this.warenkorbIdStr !== null ? parseInt(this.warenkorbIdStr, 10) : null;

    if (this.warenkorbId === null || isNaN(this.warenkorbId)) {
      console.error('Invalid warenkorbId:', this.warenkorbIdStr);
    } else {
      console.log('Converted Long:', this.warenkorbId);
    }

    this.cartService.getCartDetails(this.warenkorbId).subscribe({
      next: (response) => {
        this.cart = response.cartItems.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        console.log('Warenkorbdetails geladen:', this.cart);
      },
      error: (error) => {
        console.error('Fehler beim Laden der Warenkorbdetails:', error);
      }
    });
  }


  clearCart(): void {
    this.cartService.clearCart(this.warenkorbId);
    this.cart = [];
    this.notificationMessage = 'Der Warenkorb wurde geleert!';
    setTimeout(() => this.notificationMessage = '', 3000); // Hide message after 3 seconds
  }


  removeFromCart(product: Product): void {
    this.productId = product.id;
    // Finden des Index des Produkts im cart Array
    const productIndex = this.cart.findIndex(product => product.id === this.productId);
    // Produkt aus dem Array entfernen, falls gefunden
    if (productIndex !== -1) {
      this.cart.splice(productIndex, 1);
    }
    // Aufrufen der removeFromCart Methode im Service, um das Produkt backendseitig zu entfernen
    this.cartService.removeFromCart(this.productId, this.warenkorbId);
    this.notificationMessage = `${product.name} wurde aus dem Warenkorb entfernt!`;
    setTimeout(() => this.notificationMessage = '', 3000); // Hide message after 3 seconds
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      alert('Die Menge muss mindestens 1 sein');
      // Optional: Setzen Sie die Menge auf einen gültigen Wert zurück
      const product = this.cart.find(p => p.id === productId);
      if (product) {
        product.quantity = 1;
      }
      return;
    }
    this.cartService.updateQuantity(productId, quantity, this.warenkorbId);
  }

  saveOriginalQuantity(product: Product): void {
    // Speichern der aktuellen Menge als ursprüngliche Menge
    product.originalQuantity = product.quantity;
  }

  updateQuantityIfChanged(product: Product): void {
    if (product.quantity !== product.originalQuantity) {
      // Aufrufen der updateQuantity Methode, wenn sich die Menge geändert hat
      this.updateQuantity(product.id, product.quantity);
      // Aktualisieren der ursprünglichen Menge nach dem Update
      product.originalQuantity = product.quantity;
    }
  }

  getTotalCartValue() {
    return this.cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  }
}
