import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentKeyComponent } from './enrollment-key.component';

describe('EnrollmentKeyComponent', () => {
  let component: EnrollmentKeyComponent;
  let fixture: ComponentFixture<EnrollmentKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentKeyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrollmentKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
