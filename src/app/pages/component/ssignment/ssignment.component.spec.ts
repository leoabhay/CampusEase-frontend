import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsignmentComponent } from './ssignment.component';

describe('SsignmentComponent', () => {
  let component: SsignmentComponent;
  let fixture: ComponentFixture<SsignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
