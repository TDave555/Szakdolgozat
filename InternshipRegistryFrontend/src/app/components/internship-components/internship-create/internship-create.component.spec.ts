import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipCreateComponent } from './internship-create.component';

describe('InternshipCreateComponent', () => {
  let component: InternshipCreateComponent;
  let fixture: ComponentFixture<InternshipCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
