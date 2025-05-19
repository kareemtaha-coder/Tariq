import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError, Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactsService } from '../../../Core/services/contacts.service';

export interface ContactFormData {
  name: string;
  country: string;
  phone: string;
  numberOfChildren: number;
  planChoice: string;
  brandName: string;
  course: string;
  city: string;
}

@Component({
  selector: 'app-contact-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.css'
})
export class ContactFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  private subscription: Subscription | null = null;

  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  isSuccess = false;
  isError = false;
  errorMessage = '';

  // Animation flags
  showSuccessAnimation = false;
  showErrorAnimation = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private contactsService: ContactsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initForm();
    // Subscribe to the modal state from the service
    this.subscription = this.contactsService.isModalOpen$.subscribe(
      isOpen => {
        this.isOpen = isOpen;
        if (isOpen) {
          this.resetAnimations();
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    this.subscription?.unsubscribe();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      numberOfChildren: [0, [Validators.required, Validators.min(0)]],
      planChoice: ['basic'],
      course: ['', Validators.required],
      brandName: ['tabiiyn'] // Updated brand name to match your site
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  closeModal(event: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.resetForm();
    this.contactsService.closeModal();
  }

  resetForm(): void {
    this.submitted = false;
    this.isSuccess = false;
    this.isError = false;
    this.errorMessage = '';
    this.resetAnimations();
    this.initForm();
  }

  resetAnimations(): void {
    this.showSuccessAnimation = false;
    this.showErrorAnimation = false;

    // Reapply animations after a short delay if the modal is open
    if (this.isOpen && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.isSuccess) {
          this.showSuccessAnimation = true;
        }
        if (this.isError) {
          this.showErrorAnimation = true;
        }
      }, 100);
    }
  }

  tryAgain(): void {
    this.isError = false;
    this.errorMessage = '';
    this.resetAnimations();
  }

  submitForm(): void {
    this.submitted = true;
    if (this.contactForm.invalid) {
      // Highlight invalid fields with animation
      this.animateInvalidFields();
      return;
    }

    this.loading = true;
    const formData: ContactFormData = {
      name: this.contactForm.value.name,
      country: this.contactForm.value.country,
      phone: this.contactForm.value.phone,
      numberOfChildren: this.contactForm.value.numberOfChildren,
      planChoice: 'starter',
      brandName: 'tabiiyn', // Updated brand name
      course: this.contactForm.value.course,
      city: this.contactForm.value.city
    };

    this.http.post<any>('https://localhost:7181/api/Contacts', formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isError = true;
          this.showErrorAnimation = true;
          this.errorMessage = this.getReadableErrorMessage(error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.isSuccess = true;
          this.showSuccessAnimation = true;
        },
        error: () => {} // Error is handled in catchError
      });
  }

  getReadableErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Network error. Please check your internet connection and try again.';
    }

    if (error.status === 400) {
      return 'There was an issue with the information you provided. Please check and try again.';
    }

    if (error.status === 404) {
      return 'The server endpoint could not be found. Please try again later.';
    }

    if (error.status === 500) {
      return 'Server error. Our team has been notified. Please try again later.';
    }

    return error.message || 'An unknown error occurred. Please try again.';
  }

  animateInvalidFields(): void {
    if (isPlatformBrowser(this.platformId)) {
      const invalidFields = document.querySelectorAll('.ng-invalid.ng-touched');
      invalidFields.forEach((field: Element) => {
        field.classList.add('shake-animation');
        setTimeout(() => {
          field.classList.remove('shake-animation');
        }, 600);
      });
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control !== null && control.touched && control.hasError(errorName);
  }
}
