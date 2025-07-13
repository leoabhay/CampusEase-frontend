import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeeComponent } from './admin-fee.component';

describe('AdminFeeComponent', () => {
  let component: AdminFeeComponent;
  let fixture: ComponentFixture<AdminFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
