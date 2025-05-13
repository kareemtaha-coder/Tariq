import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // Subscribe to the modal state from the service
    this.subscription = this.contactsService.isModalOpen$.subscribe(
      isOpen => this.isOpen = isOpen
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
      brandName: ['alfath']
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
    this.initForm();
  }

  tryAgain(): void {
    this.isError = false;
    this.errorMessage = '';
  }

  submitForm(): void {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;
    const formData: ContactFormData = {
      name: this.contactForm.value.name,
      country: this.contactForm.value.country,
      phone: this.contactForm.value.phone,
      numberOfChildren: this.contactForm.value.numberOfChildren,
      planChoice: 'starter',
      brandName: 'alfath',
      course: this.contactForm.value.course,
      city: this.contactForm.value.city
    };

    this.http.post<any>('https://localhost:7181/api/Contacts', formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isError = true;
          this.errorMessage = error.message || 'An unknown error occurred';
          return throwError(() => error);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.isSuccess = true;
        },
        error: () => {} // Error is handled in catchError
      });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control !== null && control.touched && control.hasError(errorName);
  }
}
