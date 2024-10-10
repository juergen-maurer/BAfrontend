import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { UserProfileComponent } from './user-profile.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NotificationComponent} from "../notification/notification.component";

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authService: AuthService;
  let appComponent: AppComponent;

  beforeEach(async () => {
    const authServiceMock = {
      getProfile: jasmine.createSpy('getProfile').and.returnValue(of({
        firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', warenkorbId: '1',
        lastUsedAddress: { street: 'Main St', city: 'Anytown', postalCode: '12345', country: 'Country', houseNumber: '1', addressfirstName: 'John', addresslastName: 'Doe' },
        bestellungen: []
      })),

      updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of({})),
      changePassword: jasmine.createSpy('changePassword').and.returnValue(of({}))
    };

    const appComponentMock = {
      updateUserDetails: jasmine.createSpy('updateUserDetails')
    };

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent, NotificationComponent],
      imports: [FormsModule, HttpClientModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AppComponent, useValue: appComponentMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    appComponent = TestBed.inject(AppComponent);
    fixture.detectChanges();
  });

  it('should fetch and display user profile on init', () => {
    expect(authService.getProfile).toHaveBeenCalled();
    expect(component.profile.firstName).toBe('John');
    expect(component.profile.lastName).toBe('Doe');
    expect(component.profile.email).toBe('john.doe@example.com');
  });

  it('should update profile successfully', () => {
    component.profile.firstName = 'Jane';
    component.profile.lastName = 'Smith';
    component.profile.email = 'jane.smith@example.com';
    component.password = 'password';
    component.onSubmit();
    expect(authService.updateProfile).toHaveBeenCalledWith(component.user, 'password');
    expect(component.notificationMessage).toBe('Profil erfolgreich bearbeitet');
    expect(appComponent.updateUserDetails).toHaveBeenCalled();
  });

  it('should show error message when updating profile with wrong password', () => {
    (authService.updateProfile as jasmine.Spy).and.returnValue(throwError('Error'));
    component.password = 'wrongpassword';
    component.onSubmit();
    expect(component.message).toBe('Das Passwort ist falsch');
  });

  it('should toggle edit mode', () => {
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
    component.toggleEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should change password successfully', () => {
    component.oldPassword = 'oldpassword';
    component.newPassword = 'newpassword';
    component.confirmNewPassword = 'newpassword';
    component.onChangePassword();
    expect(authService.changePassword).toHaveBeenCalledWith(component.kundenId, 'oldpassword', 'newpassword');
    expect(component.notificationMessage).toBe('Passwort erfolgreich geändert');
  });

  it('should show error message when changing password with incorrect old password', () => {
    (authService.changePassword as jasmine.Spy).and.returnValue(throwError('Error'));
    component.oldPassword = 'wrongoldpassword';
    component.newPassword = 'newpassword';
    component.confirmNewPassword = 'newpassword';
    component.onChangePassword();
    expect(component.message).toBe('Altes Passwort stimmt nicht überein');
  });

  it('should show error message when new passwords do not match', () => {
    component.newPassword = 'newpassword';
    component.confirmNewPassword = 'differentpassword';
    component.onChangePassword();
    expect(component.message).toBe('Das neue Passwort stimmt nicht überein');
  });

  it('should toggle order expansion', () => {
    component.toggleBestellung(1);
    expect(component.isOrderExpanded(1)).toBeTrue();
    component.toggleBestellung(1);
    expect(component.isOrderExpanded(1)).toBeFalse();
  });

  it('should reset change password fields when toggling change password modal', () => {
    component.toggleChangePasswordModal();
    expect(component.oldPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmNewPassword).toBe('');
  });

  it('should reset password field when toggling password confirmation modal', () => {
    component.togglePasswordConfirmationModal();
    expect(component.password).toBe('');
  });
});
