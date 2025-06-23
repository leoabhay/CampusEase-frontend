import { TestBed } from '@angular/core/testing';

import { InternalRecordsService } from './internal-records.service';

describe('InternalRecordsService', () => {
  let service: InternalRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
