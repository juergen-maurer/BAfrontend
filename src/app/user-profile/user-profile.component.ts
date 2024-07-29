// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from "../User";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(user => {
      this.user = user;
    });
  }

  updateProfile(): void {
    if (this.user) {
      this.authService.updateProfile(this.user).subscribe(updatedUser => {
        this.user = updatedUser;
      });
    }
  }
}
