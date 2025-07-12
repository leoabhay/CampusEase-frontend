import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRecordComponent } from './course-record.component';

describe('CourseRecordComponent', () => {
  let component: CourseRecordComponent;
  let fixture: ComponentFixture<CourseRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
