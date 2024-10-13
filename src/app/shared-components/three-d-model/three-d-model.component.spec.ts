import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDModelComponent } from './three-d-model.component';

describe('Model3DComponent', () => {
  let component: ThreeDModelComponent;
  let fixture: ComponentFixture<ThreeDModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeDModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeDModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
