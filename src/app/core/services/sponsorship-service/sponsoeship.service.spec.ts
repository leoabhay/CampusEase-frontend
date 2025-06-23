import { TestBed } from '@angular/core/testing';

import { SponsoeshipService } from './sponsoeship.service';

describe('SponsoeshipService', () => {
  let service: SponsoeshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SponsoeshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
