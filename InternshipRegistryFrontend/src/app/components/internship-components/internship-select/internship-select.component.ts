import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internship-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-select.component.html',
  styleUrl: './internship-select.component.css'
})
export class InternshipSelectComponent implements OnInit {
  years: number[] = [];
  selectedYear: number;
  selectedCompleted: string = 'false'; // Default to incomplete
  completedOptions: string[] = ['all', 'true', 'false'];

  constructor(private router: Router) {
    this.selectedYear = new Date().getFullYear(); // Default to current year
  }

  ngOnInit(): void {
    this.generateYearList();
  }

  generateYearList(): void {
    const currentYear = new Date().getFullYear();
    for (let year = 2015; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  searchInternships(): void {
    this.router.navigate(['/internships/list'], {
      queryParams: {
        year: this.selectedYear === -1 ? 'all' : this.selectedYear,
        completed: this.selectedCompleted
      }
    });
  }
}
