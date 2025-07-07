import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalRecordsComponent } from './internal-records.component';

describe('InternalRecordsComponent', () => {
  let component: InternalRecordsComponent;
  let fixture: ComponentFixture<InternalRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternalRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
