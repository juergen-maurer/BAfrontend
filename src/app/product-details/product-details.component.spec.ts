import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../product';
import {CartResponse} from "../CartResponse";

class ActivatedRouteStub {
  paramMap = of({ get: (key: string) => '1' });
}

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockProduct: Product = {id: 1, name: 'Product 1', price: 10, category: 'Category 1', quantity: 2} as Product;
  const mockCartResponse = {cartItems: {id:0, product: mockProduct, quantity: 2} }as CartResponse;
  const mockSimilarProducts: Product[] = [
    {id: 2, name: 'Product 2', price: 20, category: 'Category 1', quantity: 1},
    {id: 3, name: 'Product 3', price: 30, category: 'Category 1', quantity: 1}
  ] as Product[];

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProduct', 'getProductsByCategory']);
    cartServiceMock = jasmine.createSpyObj('CartService', ['getCartDetails', 'addToCart']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      providers: [
        {provide: ProductService, useValue: productServiceMock},
        {provide: CartService, useValue: cartServiceMock},
        {provide: Router, useValue: routerMock},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //generiere einen test der prüft, ob die produktdetails beim aufrufen der seite geladen werden
  //verwende spyOn, um localStorage.getItem zu mocken und gib den Wert '1' zurück
  //verwende spyOn, um productServiceMock.getProduct zu mocken und gib mockProduct zurück
  //verwende spyOn, um cartServiceMock.getCartDetails zu mocken und gib mockCartResponse zurück
  //verwende spyOn, um productServiceMock.getProductsByCategory zu mocken und gib ein leeres array zurück
  //rufe ngOnInit auf
  //erwarte, dass productServiceMock.getProduct mit 1 aufgerufen wird
  //erwarte, dass component.product gleich mockProduct ist
  //erwarte, dass component.productQuantityInCart gleich 2 ist
  it('should load product details on init', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1');
    productServiceMock.getProduct.and.returnValue(of(mockProduct));
    cartServiceMock.getCartDetails.and.returnValue(of(mockCartResponse));
    productServiceMock.getProductsByCategory.and.returnValue(of([]));

    component.ngOnInit();

    expect(productServiceMock.getProduct).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
    expect(component.productQuantityInCart).toBe(2);
  });

  //generiere einen test der prüft, ob ein Fehler beim Laden der Produktdetails behandelt wird
  //verwende spyOn, um localStorage.getItem zu mocken und gib den Wert '1' zurück
  //verwende spyOn, um productServiceMock.getProduct zu mocken und gib einen Fehler zurück
  //rufe ngOnInit auf
  //erwarte, dass productServiceMock.getProduct mit 1 aufgerufen wird
  //erwarte, dass component.product gleich null ist
  it('should handle error when loading product details', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1');
    productServiceMock.getProduct.and.returnValue(throwError('Error'));

    component.ngOnInit();

    expect(productServiceMock.getProduct).toHaveBeenCalledWith(1);
    expect(component.product).toBeNull();
  });


    it('should add product to cart', () => {
      spyOn(localStorage, 'getItem').and.returnValue('1');
      component.product = mockProduct;
      component.selectedQuantity = 2;
      cartServiceMock.addToCart.and.returnValue(of({}));

      component.addToCart();

      expect(cartServiceMock.addToCart).toHaveBeenCalledWith(1, 2, 1);
      expect(component.notificationMessage).toBe('Product 1 wurde erfolgreich in den Warenkorb gelegt!');
    });

    it('should handle error when adding product to cart', () => {
      spyOn(localStorage, 'getItem').and.returnValue('1');
      component.product = mockProduct;
      component.selectedQuantity = 2;
      cartServiceMock.addToCart.and.returnValue(throwError('Error'));

      component.addToCart();

      expect(cartServiceMock.addToCart).toHaveBeenCalledWith(1, 2, 1);
      expect(component.notificationMessage).toBe('Melden Sie sich an, um das Produkt in den Wagen zu legen');
    });

    it('should fetch similar products', () => {
      productServiceMock.getProductsByCategory.and.returnValue(of(mockSimilarProducts));

      component.product = mockProduct;
      component.fetchSimilarProducts('Category 1');

      expect(productServiceMock.getProductsByCategory).toHaveBeenCalledWith('Category 1');
      expect(component.similarProducts.length).toBe(2);
      expect(component.similarProducts[0].id).toBe(2);
    });

    it('should open and close modal', () => {
      component.openModal('imageSrc');
      expect(component.isModalOpen).toBe(true);
      expect(component.modalImageSrc).toBe('imageSrc');

      component.closeModal();
      expect(component.isModalOpen).toBe(false);
    });
  });
