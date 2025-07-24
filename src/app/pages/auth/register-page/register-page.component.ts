import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin-register/admin-register.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import { PasswordService } from '../../../core/services/password.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  adminForm: FormGroup;
  message: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router, private passwordService: PasswordService) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.adminForm.valid) {
      const { password, confirmPassword } = this.adminForm.value;

      if (password !== confirmPassword) {
        this.isError = true;
        this.message = 'Passwords do not match.';
        return;
      }

      this.adminService.signupAdmin(this.adminForm.value).subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.isError = false;
          this.adminForm.reset();
          alertify.success('Signup successful');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.isError = true;
          this.message = err.error?.message || 'Something went wrong';
        }
      });
    } else {
      this.adminForm.markAllAsTouched();
      this.isError = true;
      this.message = 'Please fill out all fields correctly.';
    }
  }
}
