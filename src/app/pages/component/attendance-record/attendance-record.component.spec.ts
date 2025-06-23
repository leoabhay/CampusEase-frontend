import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRecordComponent } from './attendance-record.component';

describe('AttendanceRecordComponent', () => {
  let component: AttendanceRecordComponent;
  let fixture: ComponentFixture<AttendanceRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
