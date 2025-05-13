import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsDashboardComponent } from './contacts-dashboard.component';

describe('ContactsDashboardComponent', () => {
  let component: ContactsDashboardComponent;
  let fixture: ComponentFixture<ContactsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
