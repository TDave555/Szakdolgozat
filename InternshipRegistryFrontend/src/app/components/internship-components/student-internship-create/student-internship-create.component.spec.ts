import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInternshipCreateComponent } from './student-internship-create.component';

describe('StudentInternshipCreateComponent', () => {
  let component: StudentInternshipCreateComponent;
  let fixture: ComponentFixture<StudentInternshipCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInternshipCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInternshipCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
