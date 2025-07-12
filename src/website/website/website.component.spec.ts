import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/pages/admin-component/admin-cv-list/admin-cv-list.component.spec.ts
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
========
import { WebsiteComponent } from './website.component';

describe('WebsiteComponent', () => {
  let component: WebsiteComponent;
  let fixture: ComponentFixture<WebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebsiteComponent);
>>>>>>>> b231c98491e06e0fe47e2223fc2cdeea134f7dbc:src/website/website/website.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
