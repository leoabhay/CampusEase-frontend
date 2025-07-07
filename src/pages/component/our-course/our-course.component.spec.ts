import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurCourseComponent } from './our-course.component';

describe('OurCourseComponent', () => {
  let component: OurCourseComponent;
  let fixture: ComponentFixture<OurCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
