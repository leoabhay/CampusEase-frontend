import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterEnrollComponent } from './semester-enroll.component';

describe('SemesterEnrollComponent', () => {
  let component: SemesterEnrollComponent;
  let fixture: ComponentFixture<SemesterEnrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterEnrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemesterEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
