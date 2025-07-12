import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-cv-submission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cv-submission.component.html',
  styleUrls: ['./cv-submission.component.css']
})
export class CvSubmissionComponent {
  cvForm: FormGroup;
  submitting = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cv: [null, Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.cvForm.patchValue({ cv: event.target.files[0] });
    }
  }

  submitCv() {
    if (this.cvForm.invalid) return;

    this.submitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const formData = new FormData();
    formData.append('name', this.cvForm.get('name')?.value);
    formData.append('email', this.cvForm.get('email')?.value);
    formData.append('phone', this.cvForm.get('phone')?.value);
    formData.append('cv', this.cvForm.get('cv')?.value);

    this.http.post(`${environment.api_url}submit-cv`, formData).subscribe({
      next: () => {
        this.successMsg = 'CV submitted successfully. Please wait for the response.';
        this.cvForm.reset();
        this.submitting = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to submit CV. Please try again.';
        console.error(err);
        this.submitting = false;
      }
    });
  }
}
