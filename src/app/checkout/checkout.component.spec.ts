// src/app/checkout/checkout.component.spec.ts
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {CustomCurrencyPipe} from "../CustomCurrencyPipe";

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockRouter: any;
  let mockCartService: any;
  let mockAuthService: any;
  let mockOrderService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue({
        extras: { state: { warenkorbId: 1 } }
      })
    };
    mockCartService = {
      getCartDetails: jasmine.createSpy('getCartDetails').and.returnValue(of({
        cartItems: [{ product: { price: 10 }, quantity: 2 }]
      }))
    };
    mockAuthService = {
      getProfile: jasmine.createSpy('getProfile').and.returnValue(of({
        lastUsedAddress: {
          country: 'Germany',
          addressfirstName: 'FirstName',
          addresslastName: 'LastName',
          postalCode: '12345',
          street: 'Street',
          city: 'City',
          houseNumber: '1'
        }
      }))
    };
    mockOrderService = {
      submitOrder: jasmine.createSpy('submitOrder').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent, NotificationComponent, CustomCurrencyPipe],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart details on init', () => {
    component.ngOnInit();
    expect(mockCartService.getCartDetails).toHaveBeenCalledWith(1);
    expect(component.orderDetails.items.length).toBe(1);
    expect(component.orderDetails.total).toBe(20);
  });

  it('should load user profile on init', () => {
    component.ngOnInit();
    fixture.detectChanges(); // Ensure the form is updated
    expect(mockAuthService.getProfile).toHaveBeenCalled();
    expect(component.checkoutForm.value.country).toBe('Germany');
  });

  it('should submit order successfully', fakeAsync(() => {
    component.checkoutForm.setValue({
      country: 'Country',
      addressfirstName: 'FirstName',
      addresslastName: 'LastName',
      postalCode: '12345',
      street: 'Street',
      city: 'City',
      houseNumber: '1',
      paymentMethod: 'Credit Card'
    });
    component.confirmOrder();
    expect(mockOrderService.submitOrder).toHaveBeenCalled();
    tick(2000); // Simulate the delay
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should handle order submission error', () => {
    mockOrderService.submitOrder.and.returnValue(throwError('error'));
    component.checkoutForm.setValue({
      country: 'Country',
      addressfirstName: 'FirstName',
      addresslastName: 'LastName',
      postalCode: '12345',
      street: 'Street',
      city: 'City',
      houseNumber: '1',
      paymentMethod: 'Credit Card'
    });
    spyOn(window, 'alert');
    component.confirmOrder();
    expect(window.alert).toHaveBeenCalledWith('Fehler beim Abschließen der Bestellung.');
  });

  it('should toggle modal visibility', () => {
    component.toggleModal();
    expect(component.isModalOpen).toBeTrue();
    component.toggleModal();
    expect(component.isModalOpen).toBeFalse();
  });
});
