import { Component, OnDestroy, OnInit } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { DocumentService } from '../../../services/document.service';
import { CompanyService } from '../../../services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentSelfService } from '../../../services/student-self.service';
import { InternshipDto } from '../../../models/internship-dto.model';
import { DocumentDto } from '../../../models/document-dto.model';
import { CompanyDto } from '../../../models/company-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-internship-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-internship-details.component.html',
  styleUrl: './student-internship-details.component.css'
})
export class StudentInternshipDetailsComponent implements OnInit, OnDestroy {

  internship: InternshipDto | null = null;
  internshipForm: FormGroup;
  documents: DocumentDto[] = [];
  uploadProgress: number | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  isSaving = false;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentSelfService: StudentSelfService,
    private documentService: DocumentService,
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.internshipForm = this.fb.group({
      student: [null],
      company: [null],
      startDate: [null],
      endDate: [null],
      weeks: [null],
      companyInstructor: [null],
      grade: [null],
      certificateDate: [null],
      completed: [false],
    });
  }

  ngOnInit(): void {
      this.loadInternshipDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInternshipDetails(): void {
    this.loading = true;
    this.error = null;
    this.studentSelfService.getOwnInternship().pipe(takeUntil(this.destroy$)).subscribe({
        next: (internship: InternshipDto) => {
          this.internship = internship;

          if (this.internship.grade == 0) {
            this.internship.grade = undefined;
          }
          this.internshipForm.patchValue({
            startDate: this.internship.startDate.toISOString().split('T')[0],
            endDate: this.internship.endDate? this.internship.endDate.toISOString().split('T')[0] : null,
            weeks: this.internship.weeks,
            companyInstructor: this.internship.companyInstructor,
            grade: this.internship.grade,
            certificateDate: this.internship.certificateDate? this.internship.certificateDate.toISOString().split('T')[0] : null,
            completed: this.internship.completed,
            student: this.internship.student.name + ' ('
              + this.internship.student.neptuncode + ')',
            company: this.internship.company.name,
          });


          this.loadDocuments();
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
        },
      });
  }

  loadDocuments(): void {
    this.loading = true;
    this.error = null;
    this.documentService.getAllDocumentsByInternshipId(this.internship?.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load documents: ' + err.status;
        this.loading = false;
      },
    });
  }

  downloadDocument(doc: DocumentDto): void {
    this.error = null;
    this.documentService.downloadDocument(doc.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (blob: Blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.title + '.' + doc.fileExtension;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else {
          this.error = 'Failed to download the document.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to download the document: ' + err.status;
      },
    });
  }

  handleFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadDocument();
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadDocument(): void {
    this.uploadProgress = 0;
    this.error = null;
    if (this.internship && this.selectedFile) {
      this.documentService.uploadDocument(this.selectedFile, this.internship.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.uploadProgress = null;
          }
          this.selectedFile = null;
          this.loadDocuments();
        },
        error: (err: HttpErrorResponse) => {
          this.uploadProgress = null;
          this.error = 'Failed to upload document: ' + err.status;
        },
        complete: () => {
          this.uploadProgress = null;
        },
      });
    }
  }

  deleteDocument(doc: DocumentDto): void {
    this.error = null;
    this.documentService.deleteDocumentById(doc.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadDocuments();

      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to delete document: ' + err.status;
      },
    });
  }

  navToCreate(): void {
    this.router.navigate(['/my-internship/create']);
  }
}
