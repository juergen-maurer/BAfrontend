import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../User';
import { Profile } from '../Profile';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a user', () => {
    const mockUser: User = { /* user properties */ } as User;
    const mockResponse = { kundenId: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', warenkorbId: '123' };

    service.register(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login a user', () => {
    const mockCredentials = { email: 'john.doe@example.com', password: 'password' };
    const mockResponse = { kundenId: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', warenkorbId: '123' };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get user profile', () => {
    const mockProfile: Profile = { /* profile properties */ } as Profile;

    service.getProfile(1).subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/profile?id=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  it('should update user profile', () => {
    const mockUser: User = { /* user properties */ } as User;
    const mockResponse: User = { /* updated user properties */ } as User;

    service.updateProfile(mockUser, 'newPassword').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/profile/{kunde}');
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should change user password', () => {
    const mockResponse = { message: 'Password changed successfully' };

    service.changePassword(1, 'oldPassword', 'newPassword').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/change-password/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should logout user', () => {
    service.logout().subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should return true if user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('123');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });
});
