import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';
import { FormsModule } from '@angular/forms';
import { EnumFormatterPipe } from '../EnumFormatterPipe';
import { CustomCurrencyPipe } from '../CustomCurrencyPipe';
import { HttpClientModule } from '@angular/common/http';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: any;
  let mockCartService: any;
  let mockSearchService: any;
  let mockAuthService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockProductService = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of([
        {id: 1, name: 'Product 1', category: 'Category 1', price: 10},
        {id: 2, name: 'Product 2', category: 'Category 2', price: 20},
      ]))
    };
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockSearchService = jasmine.createSpyObj('SearchService', ['search']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockActivatedRoute = {queryParams: of({search: 'Product'})};
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent, NotificationComponent, EnumFormatterPipe, CustomCurrencyPipe],
      imports: [FormsModule, HttpClientModule],
      providers: [
        {provide: ProductService, useValue: mockProductService},
        {provide: CartService, useValue: mockCartService},
        {provide: SearchService, useValue: mockSearchService},
        {provide: AuthService, useValue: mockAuthService},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
  });

  it('should extract categories from products', () => {
    component.extractCategories();
    expect(component.categories.length).toBe(2);
    expect(component.categories).toContain('Category 1');
    expect(component.categories).toContain('Category 2');
  });

  it('should filter products by category and price range', () => {
    component.filterProducts('Category 1', '0-15');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product 1');
  });

  it('should filter products by search term', () => {
    component.searchTerm = 'Product 2';
    component.filterProducts('', '');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product 2');
  });

  it('should handle empty search term', () => {
    component.searchTerm = '';
    component.filterProducts('', '');
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should handle invalid price range', () => {
    component.filterProducts('', 'invalid');
    expect(component.filteredProducts.length).toBe(2);
  })
});


