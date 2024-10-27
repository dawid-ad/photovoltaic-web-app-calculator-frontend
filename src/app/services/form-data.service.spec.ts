import { TestBed } from '@angular/core/testing';

import { CalculationFormDataService } from './calculation-form-data.service';

describe('FormDataService', () => {
  let service: CalculationFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
