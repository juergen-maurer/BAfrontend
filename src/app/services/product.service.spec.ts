import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all products', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', price: 10, category: 'Category 1', quantity: 1 },
      { id: 2, name: 'Product 2', price: 20, category: 'Category 2', quantity: 2 }
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:8080/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve a product by ID', () => {
    const mockProduct: Product = { id: 1, name: 'Product 1', price: 10, category: 'Category 1', quantity: 1 };

    service.getProduct(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:8080/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should retrieve products by category', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', price: 10, category: 'Category 1', quantity: 1 },
      { id: 2, name: 'Product 2', price: 20, category: 'Category 1', quantity: 2 }
    ];

    service.getProductsByCategory('Category 1').subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:8080/products/category/Category 1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should handle error when retrieving all products', () => {
    spyOn(console, 'error');

    service.getProducts().subscribe(
      () => fail('expected an error, not products'),
      error => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne('http://localhost:8080/products');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when retrieving a product by ID', () => {
    spyOn(console, 'error');

    service.getProduct(1).subscribe(
      () => fail('expected an error, not a product'),
      error => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne('http://localhost:8080/products/1');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when retrieving products by category', () => {
    spyOn(console, 'error');

    service.getProductsByCategory('Category 1').subscribe(
      () => fail('expected an error, not products'),
      error => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne('http://localhost:8080/products/category/Category 1');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
