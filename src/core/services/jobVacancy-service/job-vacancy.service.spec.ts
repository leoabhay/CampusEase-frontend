import { TestBed } from '@angular/core/testing';

import { JobVacancyService } from './job-vacancy.service';

describe('JobVacancyService', () => {
  let service: JobVacancyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobVacancyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
