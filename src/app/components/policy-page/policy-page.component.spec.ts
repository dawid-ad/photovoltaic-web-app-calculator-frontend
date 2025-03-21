import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPageComponent } from './policy-page.component';

describe('PolicyComponent', () => {
  let component: PolicyPageComponent;
  let fixture: ComponentFixture<PolicyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
