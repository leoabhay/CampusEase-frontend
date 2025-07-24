import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  setPasswordForm: FormGroup;
  token: string | null = null;

  constructor() {
    this.setPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onSubmit(): void {
    if (this.setPasswordForm.invalid || !this.token) {
      alertify.error('Please fill in the form correctly');
      return;
    }

    const { newPassword, confirmPassword } = this.setPasswordForm.value;

    this.http
      .post(`${environment.api_url}set-password?token=${this.token}`, {
        newPassword,
        confirmPassword,
      })
      .subscribe({
        next: (res: any) => {
          alertify.success(res.message || 'Password set successfully!');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('Set password error:', err);
          alertify.error(err?.error?.message || 'Something went wrong');
        }
      });
  }
}
