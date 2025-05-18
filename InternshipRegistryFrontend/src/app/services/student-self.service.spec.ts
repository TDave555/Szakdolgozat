import { TestBed } from '@angular/core/testing';

import { StudentSelfService } from './student-self.service';

describe('StudentSelfService', () => {
  let service: StudentSelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSelfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
