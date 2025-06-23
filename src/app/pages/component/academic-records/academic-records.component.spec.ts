import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicRecordsComponent } from './academic-records.component';

describe('AcademicRecordsComponent', () => {
  let component: AcademicRecordsComponent;
  let fixture: ComponentFixture<AcademicRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
