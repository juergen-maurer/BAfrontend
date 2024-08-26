// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from "../User";
import {AppComponent} from "../app.component";
import {Address, Profile} from "../Profile";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile:Profile = {
    firstName: '', lastName: '', email: '', warenkorbId: '',
    lastUsedAddress: { street: '', city: '', postalCode: '', country: '', houseNumber: '', addressfirstName: '', addresslastName: '' },
    bestellungen: []
  }

  user: User = {email: '', firstName: '', lastName: '' };
  expandedOrders: Set<number> = new Set<number>();

  password: string = '';
  message: string = '';
  kundenIdStr: string | null = null;
  kundenId: number | null = null;
  isEditing: boolean = false;

  showChangePasswordModal: boolean = false;
  showPasswordConfirmationModal = false;

  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  confirmOldPassword: string = '';
  constructor(private authService: AuthService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.kundenIdStr = localStorage.getItem('kundenId');
    this.kundenId = this.kundenIdStr !== null ? parseInt(this.kundenIdStr, 10) : null;
    this.authService.getProfile(this.kundenId).subscribe({
      next: (data) => {
        console.log('Profile data:', data); // Log the data element
        this.profile = data;
        this.user.id=data.id;
      },
      error: (err) => console.error('Error fetching profile', err)
    });
  }

  toggleBestellung(orderId: number): void {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrders.has(orderId);
  }

  onSubmit(): void {
    this.user.firstName= this.profile.firstName;
    this.user.lastName= this.profile.lastName;
    this.user.email= this.profile.email;
    this.authService.updateProfile(this.user, this.password).subscribe({
      next: () => {
        console.log(this.user);
        this.message = 'Profile updated successfully!';
        this.isEditing = false;
        localStorage.setItem('firstName', <string>this.user.firstName);
        //localStorage.setItem('lastName', <string>this.profile.lastName);
        //localStorage.setItem('email', this.profile.email);
        this.appComponent.updateUserDetails();
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.message = 'Error updating profile';
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  toggleChangePasswordModal() {
    this.showChangePasswordModal = !this.showChangePasswordModal;
    if (this.showChangePasswordModal) {
      this.resetChangePasswordFields();
    }
  }
  resetChangePasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  togglePasswordConfirmationModal() {
    this.showPasswordConfirmationModal = !this.showPasswordConfirmationModal;
    if (this.showPasswordConfirmationModal) {
      this.resetPasswordField();
    }
  }
  resetPasswordField() {
    this.password = '';
  }
  showPasswordModal() {
    this.togglePasswordConfirmationModal();
  }
  // Update your component TypeScript file to include the closeModal method

  onChangePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.message = 'New passwords do not match';
      return;
    }
    this.authService.changePassword(this.kundenId, this.oldPassword, this.newPassword).subscribe({

      next: () => {
        this.message = 'Password changed successfully!';
        this.toggleChangePasswordModal();
      },
      error: (err) => {
        //console.error('Error changing password', err);
        this.message = 'Error changing password';
      }
    });
  }

  onConfirmPassword() {
    // Validate the current password and submit the form if valid
      this.togglePasswordConfirmationModal();
      this.onSubmit();
      //this.message = 'Incorrect password';
    }


}
