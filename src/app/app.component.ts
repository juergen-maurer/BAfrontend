import { Component, OnInit} from '@angular/core';
import {SearchService} from "./services/search.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchTerm: string = '';
  firstName: string | null = null;
  lastName: string | null = null;
  warenkorbId: number | null = null;
  isDropdownVisible: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private searchService: SearchService, private router:Router) {
   this.updateUserDetails();
  }

  ngOnInit(): void {
    // Initialisierungslogik hier
    this.checkLoginStatus();
  }
  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('firstName');
  }

  updateUserDetails(): void {
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.warenkorbId = localStorage.getItem('warenkorbId') ? parseInt(localStorage.getItem('warenkorbId') || '0', 10) : null;

  }
  onSearchTermChange(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchService.setSearchTerm(this.searchTerm);
      this.router.navigate(['/products'],{queryParams:{search:this.searchTerm}});
    }
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('kundenId');
    localStorage.removeItem('warenkorbId');
    this.updateUserDetails();
    this.router.navigate(['/login']);
  }
  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
