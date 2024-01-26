import { TestBed } from '@angular/core/testing';

import { SppinerInterceptor} from './sppiner-interceptor';

describe('SppinerInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SppinerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SppinerInterceptor = TestBed.inject(SppinerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
