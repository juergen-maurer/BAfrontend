import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../product';
import { CartResponse } from '../CartResponse';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add product to cart', () => {
    const mockResponse = {};
    service.addToCart(1, 2, 1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('/add') && req.params.has('productId') && req.params.has('quantity') && req.params.has('cartId'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get cart details', () => {
    const mockResponse: CartResponse = { cartItems: [{ id: 0, product: { id: 1, name: 'Product 1', price: 10, category: 'Category 1', quantity: 2 } as Product, quantity: 2 }] };
    service.getCartDetails(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('/get') && req.params.has('cartId'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should clear cart', () => {
    service.clearCart(1);
    const req = httpMock.expectOne(req => req.url.includes('/clear') && req.params.has('cartId'));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error when clearing cart', () => {
    spyOn(console, 'error');
    service.clearCart(1);
    const req = httpMock.expectOne(req => req.url.includes('/clear') && req.params.has('cartId'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    expect(console.error).toHaveBeenCalledWith('Fehler beim Löschen des Warenkorbs:', 'Error');
  });

  it('should remove product from cart', () => {
    service.removeFromCart(1, 1);
    const req = httpMock.expectOne(req => req.url.includes('/remove/1') && req.params.has('cartId'));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error when removing product from cart', () => {
    spyOn(console, 'error');
    service.removeFromCart(1, 1);
    const req = httpMock.expectOne(req => req.url.includes('/remove/1') && req.params.has('cartId'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    expect(console.error).toHaveBeenCalledWith('Fehler beim Entfernen des Produkts:', 'Error');
  });

  it('should update product quantity in cart', () => {
    service.updateQuantity(1, 2, 1);
    const req = httpMock.expectOne(req => req.url.includes('/update') && req.params.has('productId') && req.params.has('quantity') && req.params.has('cartId'));
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error when updating product quantity in cart', () => {
    spyOn(console, 'error');
    service.updateQuantity(1, 2, 1);
    const req = httpMock.expectOne(req => req.url.includes('/update') && req.params.has('productId') && req.params.has('quantity') && req.params.has('cartId'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    expect(console.error).toHaveBeenCalledWith('Fehler beim Ändern der Produktmenge:', 'Error');
  });
});
