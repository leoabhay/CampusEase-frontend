import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMaterialsComponent } from './assignment-materials.component';

describe('AssignmentMaterialsComponent', () => {
  let component: AssignmentMaterialsComponent;
  let fixture: ComponentFixture<AssignmentMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentMaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignmentMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
