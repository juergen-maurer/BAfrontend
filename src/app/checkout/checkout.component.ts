// src/app/checkout/checkout.component.ts
import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { Product } from '../product';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
  }
)
export class CheckoutComponent {
  orderDetails = {
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: '',
      houseNumber: '',
      lastName:'',
      firstName:'',
    },
    items: [] as Product[],
    paymentMethod: 'Credit Card',
    total: 0
  };

  warenkorbId: number | null = null;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private route:ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.warenkorbId = params['warenkorbId'] ? parseInt(params['warenkorbId'], 10) : null;
    });
    this.loadCartDetails();
  }

  loadCartDetails(): void {
    this.cartService.getCartDetails(this.warenkorbId).subscribe({
      next: (response) => {
        //console.log('Response:', response);
        this.orderDetails.items = response.cartItems.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        //console.log('Order details items:', this.orderDetails.items); // Log the mapped items
        this.orderDetails.total = this.orderDetails.items.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        //console.log('Order details total:', this.orderDetails.total); // Log the total
        },
      error: (error) => {
        console.error('Fehler beim Laden der Warenkorbdetails:', error);
      }
    });
      //this.orderDetails.items = cart;
      //this.orderDetails.total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  }

  submitOrder(): void {
    this.orderService.submitOrder(this.orderDetails).subscribe({
      next: () => {
        alert('Ihre Bestellung wurde erfolgreich abgeschlossen!');
        this.router.navigate(['/']);
        },
      error: () => {
        alert('Fehler beim Abschließen der Bestellung.');
      }
    });
  }
}
