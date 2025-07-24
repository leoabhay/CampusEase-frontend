import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private userSignIn: UserAuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.checkUserToken();
  }

  checkUserToken(): void {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      this.router.navigate(['/dashboard']);
    }
  }

 loginButton(): void {
  if (this.loginForm.valid) {
    this.userSignIn.postUserSignIn(this.loginForm.value).subscribe({
      next: (res) => {
        const message = res?.message?.toLowerCase() || '';

        if (message === 'login sucessfull') {
          localStorage.setItem('userData', JSON.stringify(this.loginForm.value));
          localStorage.setItem('userRole', res.role);
          localStorage.setItem('userToken', res.token);
          this.router.navigate(['/dashboard']);
          alertify.success('Login Successful');
        } else if (message.includes('not found')) {
          alertify.error('Email not found');
        } else if (message.includes('not verified')) {
          alertify.error('User is not verified. Please verify before login!');
        } else if (message.includes('password is incorrect')) {
          alertify.error('Incorrect password');
        } else {
          alertify.error(res.message || 'Login failed');
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message?.toLowerCase() || '';
        const role = err?.error?.userData?.role?.toLowerCase();

        if (
          err.status === 403 &&
          errorMessage.includes('set your password') &&
          role !== 'admin'
        ) {
          alertify.error('Please change your password first');
        } else {
          alertify.error('Login failed. Try again.');
        }
      }
    });
  } else {
    alertify.error('Invalid form');
  }
}
}
