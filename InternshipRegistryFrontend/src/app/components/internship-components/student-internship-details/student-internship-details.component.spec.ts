import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInternshipDetailsComponent } from './student-internship-details.component';

describe('StudentInternshipDetailsComponent', () => {
  let component: StudentInternshipDetailsComponent;
  let fixture: ComponentFixture<StudentInternshipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInternshipDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInternshipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
