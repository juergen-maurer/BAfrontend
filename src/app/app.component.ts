import {Component, OnInit} from '@angular/core';
import {SearchService} from "./services/search.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = ['Elektronik', 'Kleidung', 'Haushalt'];
  firstName: string | null = null;
  lastName: string | null = null;


  constructor(private searchService: SearchService, private router:Router) {
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
  }

  ngOnInit(): void {
    // Initialisierungslogik hier
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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    this.firstName = null;
    this.lastName = null;
    this.router.navigate(['/login']);
  }

}
