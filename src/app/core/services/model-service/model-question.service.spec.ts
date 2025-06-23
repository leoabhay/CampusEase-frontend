import { TestBed } from '@angular/core/testing';

import { ModelQuestionService } from './model-question.service';

describe('ModelQuestionService', () => {
  let service: ModelQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
