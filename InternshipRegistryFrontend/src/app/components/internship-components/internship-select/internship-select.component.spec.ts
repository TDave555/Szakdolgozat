import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipSelectComponent } from './internship-select.component';

describe('InternshipSelectComponent', () => {
  let component: InternshipSelectComponent;
  let fixture: ComponentFixture<InternshipSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
