import { TestBed } from '@angular/core/testing';

import { JsonwtService } from './jsonwt.service';

describe('JsonwtService', () => {
  let service: JsonwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonwtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
