// src/app/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';

import { CartService } from '../services/cart.service';
import { Product } from '../product';
import {ProductService} from "../services/product.service";
import {SearchService} from "../services/search.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedCategory: string ="";
  categories: string[] =[];
  filteredProducts: Product[] = [];
  selectedPriceRange: string = "";
  notificationMessage: string = "";
  searchTerm: string = '';
  warenkorbIdStr: string |null =null;
  warenkorbId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private searchService: SearchService,
    private route:ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.extractCategories();

      this.route.queryParams.subscribe(params => {
        this.searchTerm = params['search'] || "";
        this.filterProducts(this.selectedCategory, this.selectedPriceRange);
      });
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.products.map(product => product.category));
    this.categories = Array.from(categorySet);
  }


  filterProducts(selectedCategory: string, selectedPriceRange: string) {
    let minPrice = 0;
    let maxPrice = Infinity;

    if (selectedPriceRange) {
      [minPrice, maxPrice] = selectedPriceRange.split('-').map(price => parseFloat(price) || 0);
      maxPrice = maxPrice || Infinity;
    }
    const normalizedSearchTerm = this.searchTerm.toLowerCase().trim();
    const searchRegex = new RegExp(normalizedSearchTerm, 'i');


    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const price = parseFloat(product.price.toString());
      const matchesPrice = price >= minPrice && price <= maxPrice;
      const matchesSearchTerm = searchRegex.test(product.name.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearchTerm;
    });
  }
  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
    this.warenkorbIdStr = localStorage.getItem('warenkorbId');
    this.warenkorbId = this.warenkorbIdStr !== null ? parseInt(this.warenkorbIdStr, 10) : null;

    if (this.warenkorbId === null || isNaN(this.warenkorbId)) {
      console.error('Invalid warenkorbId:', this.warenkorbIdStr);
    } else {
    }
    this.cartService.addToCart(product.id, 1, this.warenkorbId).subscribe({
      next: (response) => {
        this.notificationMessage = `${product.name} wurde erfolgreich in den Warenkorb gelegt!`;
        setTimeout(() => this.notificationMessage = '', 3000); // Hide message after 3 seconds
        // Hier können Sie weitere Aktionen durchführen, z.B. eine Benachrichtigung anzeigen
      },
      error: (error) => {
        console.error('Fehler beim Hinzufügen des Produkts', error);
        // Behandeln Sie Fehler, z.B. durch Anzeigen einer Fehlermeldung
      }
    });
  }
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

}

