// src/app/checkout/checkout.component.ts
import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { Product } from '../product';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Profile} from "../Profile";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
  }
)
export class CheckoutComponent {
  checkoutForm: FormGroup;
  orderDetails = {
    items: [] as Product[],
    total: 0,
    paymentMethod: ''
  };
  /*orderDetails = {
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
  };*/

  warenkorbId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      country: ['', Validators.required],
      addressfirstName: ['', Validators.required],
      addresslastName: ['', Validators.required],
      postalCode: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      houseNumber: ['', Validators.required],
      paymentMethod: ['Credit Card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.warenkorbId = params['warenkorbId'] ? parseInt(params['warenkorbId'], 10) : null;
    });
    this.loadCartDetails();
    this.loadUserProfile();
  }


  loadUserProfile(): void {
    const kundenIdStr = localStorage.getItem('kundenId');
    const kundenId = kundenIdStr !== null ? parseInt(kundenIdStr, 10) : null;
    if (kundenId) {
      this.authService.getProfile(kundenId).subscribe({
        next: (profile: Profile) => {
          console.log('Profile data:', profile); // Log the data element
          if (profile.lastUsedAddress) {
            this.checkoutForm.patchValue({
              country: profile.lastUsedAddress.country,
              addressfirstName: profile.lastUsedAddress.addressfirstName,
              addresslastName: profile.lastUsedAddress.addresslastName,
              postalCode: profile.lastUsedAddress.postalCode,
              street: profile.lastUsedAddress.street,
              city: profile.lastUsedAddress.city,
              houseNumber: profile.lastUsedAddress.houseNumber,
            });
          }
        },
        error: (err) => console.error('Error fetching profile', err)
      });
    }
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
    if (this.checkoutForm.valid) {
      const orderDetails = {
        warenkorbId: this.warenkorbId,
        address: this.checkoutForm.value,
        cartItems: this.orderDetails.items,
        total: this.orderDetails.total,
        paymentMethod: this.mapPaymentMethod(this.checkoutForm.value.paymentMethod)
      };
      console.log('Order details:', orderDetails);
      this.orderService.submitOrder(orderDetails).subscribe({
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
  private mapPaymentMethod(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'Credit Card':
        return 'CREDIT_CARD';
      case 'PayPal':
        return 'PAYPAL';
      case 'Bank Transfer':
        return 'BANK_TRANSFER';
      default:
        throw new Error('Invalid payment method');
    }
  }
}
