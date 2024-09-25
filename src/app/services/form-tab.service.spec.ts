import { TestBed } from '@angular/core/testing';

import { FormTabService } from './form-tab.service';

describe('FormTabService', () => {
  let service: FormTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
