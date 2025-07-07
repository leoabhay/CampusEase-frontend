// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { LoginPageComponent } from './login-page.component';

// describe('LoginPageComponent', () => {
//   let component: LoginPageComponent;
//   let fixture: ComponentFixture<LoginPageComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [LoginPageComponent]
//     })
//     .compileComponents();
    
//     fixture = TestBed.createComponent(LoginPageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { CommonModule } from '@angular/common';
import * as alertify from 'alertifyjs';
import { PasswordService } from '../../../core/services/password.service';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  showForgotPasswordModal: boolean = false;
  token!: string;
  resetPasswordForm!: FormGroup;


  constructor(
    private userSignIn: UserAuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private passwordResetService: PasswordService

  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.loginForm= this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      // newPassword: ['', Validators.required],
      // confirmPassword: ['', Validators.required]
    });
    // this.route.queryParams.subscribe((params: any) => {
    //   this.token = params['token'] || null;
    //   if (this.token) {
    //     this.showForgotPasswordModal = true;
    //   }
    // });

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    this.checkUserToken()
  }
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
  submitResetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const confirmPassword = this.resetPasswordForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.resetPasswordForm.setErrors({ passwordMismatch: true });
        return;
      }

      // Call AuthService method to reset password
      this.passwordResetService.resetPassword(this.token, newPassword).subscribe(
        (response) => {
          console.log('Password reset successful:', response);
          // Optionally, show success message or redirect to login page
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error resetting password:', error);
          // Handle error: display error message or handle as needed
        }
      );
    }
  }
  checkUserToken(): void {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      this.router.navigate(['/dashboard']);
    }
  }
  loginButton(){
    if(this.loginForm.valid){
      debugger
      this.userSignIn.postUserSignIn(this.loginForm.value).subscribe((res)=>{
        debugger
        if (res && res.message === 'Login Sucessfull'){
          console.log(res);
          console.log(this.loginForm.value)
          console.log(this.loginForm)
          localStorage.setItem('userData',JSON.stringify(this.loginForm.value));
          localStorage.setItem('userRole',res.role)
          // localStorage.setItem('userRole',JSON.stringify(res.role))
          // localStorage.setItem('userToken',JSON.stringify(res.token))
          localStorage.setItem('userToken',res.token)
          debugger
          this.router.navigate(['/dashboard'])
          
          alertify.success('Login  Sucessfull')

        }
        else{
          alertify.error('enter Valid username and password')

        }
      })
    }
    else{
      alertify.error('error')
    }
  }

// Open the Forgot Password modal
  openForgotPasswordModal(): void {
    this.showForgotPasswordModal = true;
  }

  // Close the Forgot Password modal
  closeForgotPasswordModal(): void {
    this.showForgotPasswordModal = false;
    this.forgotPasswordForm.reset();
  }
  submitForgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.passwordResetService.requestPasswordReset(email).subscribe(
        (response) => {
          console.log('Password reset link sent:', response);
          // Optionally, show success message or redirect to login page
        },
        (error) => {
          console.error('Error sending reset link:', error);
          // Handle error: display error message or handle as needed
        }
      );
    }
  }


}