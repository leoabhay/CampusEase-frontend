import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  token: string | null = null;
  isResetMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract token from query string
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.isResetMode = !!this.token;

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  requestResetLink(): void {
    if (this.emailForm.invalid) return;

    const email = this.emailForm.value.email;

    this.http.post<any>('http://localhost:3200/request-reset-password', { email }).subscribe({
      next: (res) => {
        alertify.success(res.message || 'Reset link sent to email');
        console.log('Reset link:', res.resetUrl); // For dev
      },
      error: (err) => {
        alertify.error(err.error?.message || 'Failed to send reset link');
      }
    });
  }

  resetPassword(): void {
    if (this.passwordForm.invalid || !this.token) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;

    this.http.post<any>(
      `http://localhost:3200/reset-password?token=${this.token}`,
      { newPassword, confirmPassword }
    ).subscribe({
      next: (res) => {
        alertify.success('Password reset successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alertify.error(err.error?.message || 'Password reset failed');
      }
    });
  }
}
