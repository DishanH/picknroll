import { TestBed } from '@angular/core/testing';

import { CartCachingService } from './cart-caching.service';

describe('CartCachingService', () => {
  let service: CartCachingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartCachingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
