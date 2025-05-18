import { TestBed } from '@angular/core/testing';

import { UserSelfService } from './user-self.service';

describe('UserSelfService', () => {
  let service: UserSelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSelfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
