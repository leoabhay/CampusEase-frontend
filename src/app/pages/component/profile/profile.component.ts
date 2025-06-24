import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { CommonModule } from '@angular/common';
import { ClubService } from '../../../core/services/club_service/club.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  showUserProfileData: any = null;
  clubList: any[] = [];
  formProfile!: FormGroup;
  changePasswordForm!: FormGroup;
  userRole: string | null = null;
  selectedFile: File | null = null;

  quickStats = {
    lastLogin: new Date(),
    accountCreated: new Date(),
    status: 'Active',
    rating: 4.8,
    coursesCount: 0
  };

  constructor(
    private userService: UserAuthService,
    private clubService: ClubService,
    private fb: FormBuilder
  ) {
    this.formProfile = this.fb.group({
      address: ['']
    });
  }

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole();
    this.loadUserProfile();
    this.loadClubs();

    this.changePasswordForm = this.fb.group({
      oldpassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private loadUserProfile(): void {
    this.userService.getuserDataLogin().subscribe({
      next: (res) => {
        this.showUserProfileData = res.data;
        this.formProfile.patchValue({
          address: this.showUserProfileData?.address || ''
        });
        this.initializeQuickStats();
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  private loadClubs(): void {
    this.clubService.getClubList().subscribe({
      next: (res) => this.clubList = res.clubName,
      error: (err) => console.error('Error loading clubs:', err)
    });
  }

  initializeQuickStats(): void {
    if (this.showUserProfileData) {
      this.quickStats = {
        lastLogin: new Date(this.showUserProfileData.lastLogin || new Date()),
        accountCreated: new Date(this.showUserProfileData.createdAt || new Date()),
        status: this.showUserProfileData.status || 'Active',
        rating: this.showUserProfileData.rating || 4.8,
        coursesCount: this.showUserProfileData.courses?.length || 0
      };
    }
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  deleteClub(clubId: string): void {
    if (confirm('Are you sure you want to delete this club?')) {
      this.clubService.delDeleteClubList(clubId).subscribe({
        next: () => this.loadClubs(),
        error: () => alert('Error deleting club')
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadPhoto();
    }
  }

  triggerFileInput(): void {
    document.getElementById('photo')?.click();
  }

  uploadPhoto(): void {
    if (!this.selectedFile || !this.showUserProfileData?._id) return;

    const formData = new FormData();
    formData.append('photo', this.selectedFile);

    this.userService.saveProfile(this.showUserProfileData._id, formData).subscribe({
      next: () => {
        alert('Profile photo updated successfully!');
        this.loadUserProfile();
      },
      error: () => alert('Error updating profile photo')
    });
  }

  onSubmit(): void {
    if (this.formProfile.invalid) return;

    const formData = new FormData();
    formData.append('address', this.formProfile.get('address')?.value);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.userService.saveProfile(this.showUserProfileData._id, formData).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.loadUserProfile();
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error?.message || 'Error updating profile');
      }
    });
  }

  onPasswordChange(): void {
    if (this.changePasswordForm.invalid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const passwordData = {
      oldpassword: this.changePasswordForm.value.oldpassword,
      password: this.changePasswordForm.value.password,
      confirmPassword: this.changePasswordForm.value.confirmPassword
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.userService.getUserToken()}`
    });

    this.userService.changePassword(
      this.showUserProfileData._id,
      passwordData,
      { headers }
    ).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.changePasswordForm.reset();
      },
      error: (err) => {
        const msg = err.error?.error || err.error?.message || 'Error changing password';
        alert(msg);
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
