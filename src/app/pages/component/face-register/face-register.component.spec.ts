import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRegisterComponent } from './face-register.component';

describe('FaceRegisterComponent', () => {
  let component: FaceRegisterComponent;
  let fixture: ComponentFixture<FaceRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
