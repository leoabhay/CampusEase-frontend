import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCvListComponent } from './admin-cv-list.component';

describe('AdminCvListComponent', () => {
  let component: AdminCvListComponent;
  let fixture: ComponentFixture<AdminCvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCvListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
