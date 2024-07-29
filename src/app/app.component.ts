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

  constructor(private searchService: SearchService, private router:Router) {}

  ngOnInit(): void {
    // Initialisierungslogik hier
  }
  onSearchTermChange(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchService.setSearchTerm(this.searchTerm);
      this.router.navigate(['/products'],{queryParams:{search:this.searchTerm}});
    }
  }

}
