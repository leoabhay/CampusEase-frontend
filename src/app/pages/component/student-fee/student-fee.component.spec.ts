import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeeComponent } from './student-fee.component';

describe('StudentFeeComponent', () => {
  let component: StudentFeeComponent;
  let fixture: ComponentFixture<StudentFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
