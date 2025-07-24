import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import * as alertify from 'alertifyjs';
import { ClubService } from '../../../core/services/club_service/club.service';
import { DepartmentService } from '../../../core/services/department-service/department.service';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { PopUpService } from '../../../core/popup/pop-up.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  selectedUserId: string | null = null;

  showTeacherData: any[] = [];
  showTeacherCount: number = 0;
  subjectListCount: number = 0;
  showStudentData: any[] = [];
  showStudentCount: number = 0;
  showSecretaryData: any[] = [];
  showSecretaryCount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserAuthService,
    private clubService: ClubService,
    private departmentService: DepartmentService,
    private enrollmentService: EnrollmentService,
    private confirmationService: PopUpService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllData();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      rollno: ['', [Validators.pattern('[0-9]*'), Validators.min(0)]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  loadAllData() {
    this.teacherData();
    this.getSubjectList();
    this.secretaryCount();
    this.studentCount();
  }

  // Call this when you want to reset the form and editing state
  resetForm() {
    this.userForm.reset();
    this.isEditMode = false;
    this.selectedUserId = null;

    // Reset password validators since on create they are required
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  // Populate form to edit, but keep password fields empty and optional
  editUser(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user._id;

    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      rollno: user.rollno,
      address: user.address,
      role: user.role,
      password: '',
      confirmPassword: ''
    });

    // Remove password validators on edit (optional to change password)
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  createUser() {
    if (this.userForm.invalid) {
      alertify.error('Please enter valid input');
      return;
    }

    if (this.userForm.value.password !== this.userForm.value.confirmPassword) {
      alertify.error('Passwords do not match');
      return;
    }

    const formData = { ...this.userForm.value };

    if (this.isEditMode && this.selectedUserId) {
      // Remove password fields when updating, so password remains unchanged
      delete formData.password;
      delete formData.confirmPassword;

      this.userService.updateUserById(this.selectedUserId, formData).subscribe(() => {
        alertify.success('User updated successfully');
        this.resetForm();
        this.loadAllData();
      }, err => {
        alertify.error('Error updating user');
      });
    } else {
      // Create user with password
      this.userService.postuserRegister(formData).subscribe(() => {
        alertify.success('User added successfully');
        this.resetForm();
        this.loadAllData();
      }, err => {
        alertify.error('Error creating user');
      });
    }
  }

  // Your existing delete and data fetching methods below:
  studentCount() {
    this.userService.getStudentData().subscribe(res => {
      this.showStudentCount = res.count;
      this.showStudentData = res.student;
    });
  }

  secretaryCount() {
    this.userService.getSecretarytData().subscribe(res => {
      this.showSecretaryCount = res.count;
      this.showSecretaryData = res.secretary;
    });
  }

  teacherData() {
    this.userService.getTeacherData().subscribe(res => {
      this.showTeacherCount = res.count;
      this.showTeacherData = res.faculty;
    });
  }

  getSubjectList() {
    this.enrollmentService.getSubjectDataListAll().subscribe(res => {
      this.subjectListCount = res.count;
    });
  }

  async deleteTeacher(teacherId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {
      this.userService.delTeacherList(teacherId).subscribe(() => {
        this.teacherData();
        this.confirmationService.showSuccessMessage('User deleted successfully');
      });
    } else {
      this.confirmationService.showErrorMessage('Sorry, cannot be deleted');
    }
  }

  async deleteStudent(studentId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {
      this.userService.delStudentList(studentId).subscribe(() => {
        this.studentCount();
        this.confirmationService.showSuccessMessage('Student deleted successfully');
      });
    } else {
      this.confirmationService.showErrorMessage('Action cancelled');
    }
  }

  async deleteSecretary(secretaryId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {
      this.userService.delSecretaryList(secretaryId).subscribe(() => {
        this.secretaryCount();
        this.confirmationService.showSuccessMessage('Secretary deleted successfully');
      });
    } else {
      this.confirmationService.showErrorMessage('Action cancelled');
    }
  }
}
