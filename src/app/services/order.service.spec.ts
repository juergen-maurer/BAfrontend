import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should submit order successfully', () => {
    const mockOrderDetails = { /* order details */ };
    const mockResponse = { /* response data */ };

    service.submitOrder(mockOrderDetails).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/order');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error when submitting order', () => {
    const mockOrderDetails = { /* order details */ };
    spyOn(console, 'error');

    service.submitOrder(mockOrderDetails).subscribe(
      () => fail('expected an error, not a success'),
      error => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne('http://localhost:8080/order');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
