import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvSubmissionComponent } from './cv-submission.component';

describe('CvSubmissionComponent', () => {
  let component: CvSubmissionComponent;
  let fixture: ComponentFixture<CvSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CvSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
