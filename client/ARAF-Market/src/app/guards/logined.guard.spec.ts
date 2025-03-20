import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginedGuard } from './logined.guard';

describe('loginedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
