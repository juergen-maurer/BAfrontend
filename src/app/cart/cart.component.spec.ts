import { of, throwError } from 'rxjs';
import { CartService } from '../services/cart.service';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
import { CartComponent } from './cart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartResponse } from '../CartResponse';
import { Product } from '../product';
import { NotificationComponent } from '../notification/notification.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let searchServiceMock: jasmine.SpyObj<SearchService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockWarenkorbId = '1';
  const mockCartItems: Product[] = [
    { id: 1, name: 'Product 1', price: 10, quantity: 2 } as Product
  ];

  beforeEach(async () => {
    cartServiceMock = jasmine.createSpyObj('CartService', ['getCartDetails', 'clearCart', 'removeFromCart', 'updateQuantity']);
    searchServiceMock = jasmine.createSpyObj('SearchService', ['getSearchTerm']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CartComponent, NotificationComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    component.warenkorbId = parseInt(mockWarenkorbId, 10); // Ensure warenkorbId is set to a valid value
    component.cart = mockCartItems; // Set mock cart items
    fixture.detectChanges();
  });

  it('should load cart details on init', () => {
    const mockCartDetails: CartResponse = { cartItems: mockCartItems.map(item => ({ product: item, quantity: item.quantity })) } as CartResponse;

    cartServiceMock.getCartDetails.and.returnValue(of(mockCartDetails));

    component.ngOnInit();

    expect(cartServiceMock.getCartDetails).toHaveBeenCalled();
    expect(component.cart.length).toBe(1);
    expect(component.cart[0].name).toBe('Product 1');
  });

  it('should handle error when loading cart details', () => {
    cartServiceMock.getCartDetails.and.returnValue(throwError('Error'));

    component.loadCartDetails();

    expect(cartServiceMock.getCartDetails).toHaveBeenCalled();
    expect(component.cart.length).toBe(0);
  });

  it('should clear the cart', () => {
    cartServiceMock.clearCart.and.returnValue(of({}));

    component.clearCart();

    expect(cartServiceMock.clearCart).toHaveBeenCalledWith(1);
    expect(component.cart.length).toBe(0);
    expect(component.notificationMessage).toBe('Der Warenkorb wurde geleert!');
  });

  it('should remove a product from the cart', () => {
    cartServiceMock.removeFromCart.and.returnValue(of({}));

    component.removeFromCart(mockCartItems[0]);

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(1, 1);
    expect(component.cart.length).toBe(0);
    expect(component.notificationMessage).toBe('Product 1 wurde aus dem Warenkorb entfernt!');
  });

  it('should update product quantity', () => {
    cartServiceMock.updateQuantity.and.returnValue(of({}));

    component.updateQuantity(1, 3);

    expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(1, 3, 1);
    expect(component.cart[0].quantity).toBe(3);
  });

  it('should not update quantity if less than 1', () => {
    spyOn(window, 'alert');

    component.updateQuantity(1, 0);

    expect(window.alert).toHaveBeenCalledWith('Die Menge muss mindestens 1 sein');
    expect(cartServiceMock.updateQuantity).not.toHaveBeenCalled();
    expect(component.cart[0].quantity).toBe(2);
  });

  it('should navigate to product detail', () => {
    component.viewProductDetail(1);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/product', 1]);
  });

  it('should navigate to checkout with warenkorbId', () => {
    component.navigateToCheckout();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/checkout'], { state: { warenkorbId: 1 } });
  });
});
