import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DocumentDto } from '../../../models/document-dto.model';
import { InternshipDto } from '../../../models/internship-dto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { DocumentService } from '../../../services/document.service';
import { InternshipService } from '../../../services/internship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateUpdateInternshipDto } from '../../../models/internship-create-update-dto.model';
import { CompanyService } from '../../../services/company.service';
import { CompanyDto } from '../../../models/company-dto.model';

@Component({
  selector: 'app-internship',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './internship.component.html',
  styleUrl: './internship.component.css'
})

export class InternshipComponent implements OnInit, OnDestroy {
  internship: InternshipDto | null = null;
  internshipId: number | null = null;
  internshipForm: FormGroup;
  documents: DocumentDto[] = [];
  companies: CompanyDto[] = [];
  uploadProgress: number | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  isSaving = false;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private internshipService: InternshipService,
    private documentService: DocumentService,
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.internshipForm = this.fb.group({
      student: [null],
      companyId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      weeks: [null, Validators.required],
      companyInstructor: [null],
      grade: [null],
      certificateDate: [null],
      completed: [false],
    });
  }

  ngOnInit(): void {
    this.internshipId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.internshipId) {
      this.loadInternshipDetails(this.internshipId);
    } else {
      this.error = 'Internship ID is required to view details.';
      this.loading = false;
    }
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInternshipDetails(id: number): void {
    this.loading = true;
    this.error = null;
    this.internshipService.getInternshipById(id).pipe(takeUntil(this.destroy$)).subscribe({
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
            companyId: this.internship.company.id,
          });


          this.loadDocuments();
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || 'Failed to load internship details.';
          this.loading = false;
          this.router.navigate(['/internships/list']);
        },
      });
  }

  loadCompanies(): void {
      this.companyService
        .getAllCompanies()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (companies: CompanyDto[]) => {
            this.companies = companies;
          },
          error: (err) => {
            this.error = err.message || 'Failed to load companies.';
          },
        });
    }

  loadDocuments(): void {
    this.loading = true;
    this.error = null;
    this.documentService.getAllDocumentsByInternshipId(this.internshipId!).pipe(takeUntil(this.destroy$)).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message || 'Failed to load documents.';
        this.loading = false;
      },
    });
  }

  saveInternship(): void {
    if (this.internshipForm.valid && this.internshipId) {
      this.isSaving = true;
      this.error = null;
      const formvalues = this.internshipForm.value;
      const updatedInternship: CreateUpdateInternshipDto = {
        studentId: this.internship?.student.id!,
        companyId: formvalues.companyId,
        startDate: formvalues.startDate,
        endDate: formvalues.endDate,
        weeks: formvalues.weeks,
        companyInstructor: formvalues.companyInstructor,
        grade: formvalues.grade,
        certificateDate: formvalues.certificateDate,
        completed: formvalues.completed,
      };

      if (updatedInternship.grade !== null && updatedInternship.grade !== undefined)
        updatedInternship.completed = true;

      this.internshipService.updateInternship(this.internshipId, updatedInternship).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.internship = response;
          this.isSaving = false;
          this.loadInternshipDetails(response.id);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || 'Failed to update internship details.';
          this.isSaving = false;
        },
      });
    } else {
      this.error = 'Please fill in the form correctly.';
    }
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
        this.error = err.message || 'Failed to download the document.';
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
    if (this.internshipId && this.selectedFile) {
      this.documentService.uploadDocument(this.selectedFile, this.internshipId).pipe(takeUntil(this.destroy$)).subscribe({
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
          this.error = 'Failed to upload document' + err.status;
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
        this.error = err.message || 'Failed to delete document.';
      },
    });
  }

  goBackToList(): void {
    this.router.navigate(['/internships/list']);
  }
}
