import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should set and get first name', () => {
    service.setFirstName('John');
    expect(service.getFirstName()).toBe('John');
  });

  it('should get first name from localStorage if not set', () => {
    localStorage.setItem('firstName', 'Jane');
    expect(service.getFirstName()).toBe('Jane');
  });

  it('should return null if first name is not set and not in localStorage', () => {
    localStorage.removeItem('firstName');
    expect(service.getFirstName()).toBeNull();
  });

  it('should return true if user is logged in', () => {
    localStorage.setItem('token', 'some-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
  });
});
