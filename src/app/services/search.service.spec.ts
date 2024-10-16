import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set search term', () => {
    service.setSearchTerm('test');
    service.getSearchTerm().subscribe(term => {
      expect(term).toBe('test');
    });
  });

  it('should get initial search term as empty string', () => {
    service.getSearchTerm().subscribe(term => {
      expect(term).toBe('');
    });
  });

  it('should update search term multiple times', () => {
    service.setSearchTerm('first');
    service.setSearchTerm('second');
    service.getSearchTerm().subscribe(term => {
      expect(term).toBe('second');
    });
  });
});
