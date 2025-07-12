import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobVacancyComponent } from './job-vacancy.component';

describe('JobVacancyComponent', () => {
  let component: JobVacancyComponent;
  let fixture: ComponentFixture<JobVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobVacancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
