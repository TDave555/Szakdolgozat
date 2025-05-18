import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipListComponent } from './internship-list.component';

describe('InternshipListComponent', () => {
  let component: InternshipListComponent;
  let fixture: ComponentFixture<InternshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
