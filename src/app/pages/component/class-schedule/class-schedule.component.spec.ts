import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassScheduleComponent } from './class-schedule.component';

describe('ClassScheduleComponent', () => {
  let component: ClassScheduleComponent;
  let fixture: ComponentFixture<ClassScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
