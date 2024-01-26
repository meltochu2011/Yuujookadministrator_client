import { TestBed } from '@angular/core/testing';

import { SppinerService } from './spinner.service';

describe('SpinnerServiceService', () => {
  let service: SppinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SppinerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
