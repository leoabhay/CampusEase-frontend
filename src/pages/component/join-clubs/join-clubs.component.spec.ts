import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinClubsComponent } from './join-clubs.component';

describe('JoinClubsComponent', () => {
  let component: JoinClubsComponent;
  let fixture: ComponentFixture<JoinClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinClubsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
