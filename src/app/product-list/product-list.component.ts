// src/app/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';

import { CartService } from '../services/cart.service';
import { Product } from '../product';
import {ProductService} from "../services/product.service";
import {Subscription} from "rxjs";
import {SearchService} from "../services/search.service";
import {ActivatedRoute} from "@angular/router";


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
  searchSubscription: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private searchService: SearchService,
    private route:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.extractCategories();

      this.route.queryParams.subscribe(params => {
        this.searchTerm = params['search'] || "";
        this.filterProducts(this.selectedCategory, this.selectedPriceRange);
        //this.searchProducts();
      });
    });

    /*this.searchSubscription = this.searchService.getSearchTerm().subscribe(term => {
      this.searchTerm = term;
      this.filterProducts(this.selectedCategory, this.selectedPriceRange);
    });*/
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  extractCategories(): void {
    const categorySet = new Set(this.products.map(product => product.category));
    this.categories = Array.from(categorySet);
  }

  searchProducts(): void {
    this.filterProducts(this.selectedCategory, this.selectedPriceRange);
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
    this.cartService.addToCart(product.id).subscribe({
      next: (response) => {
        this.notificationMessage = `${product.name} wurde erfolgreich in den Warenkorb gelegt!`;
        setTimeout(() => this.notificationMessage = '', 3000); // Hide message after 3 seconds
        console.log('Produkt erfolgreich hinzugefügt', response);
        // Hier können Sie weitere Aktionen durchführen, z.B. eine Benachrichtigung anzeigen
      },
      error: (error) => {
        console.error('Fehler beim Hinzufügen des Produkts', error);
        // Behandeln Sie Fehler, z.B. durch Anzeigen einer Fehlermeldung
      }
    });
  }

}

