import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { DepartmentService } from '../../../core/services/department-service/department.service';
import { PopUpService } from '../../../core/popup/pop-up.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-enrollment-key',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment-key.component.html',
  styleUrls: ['./enrollment-key.component.css']
})
export class EnrollmentKeyComponent implements OnInit {
  enrollmentForm: FormGroup;
  showTeacherData: any[] = [];
  departmentData: any[] = [];
  listData: any[] = [];
  editMode: boolean = false;
  currentEnrollmentId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private enrollmentService: EnrollmentService,
    private userService: UserAuthService,
    private departmentService: DepartmentService,
    private confirmationService: PopUpService
  ) {
    this.enrollmentForm = this.formBuilder.group({
      enrollmentKey: ['', Validators.required],
      semester: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      department: ['', Validators.required],
      subjects: this.formBuilder.array([this.createSubject()])
    });
  }

  ngOnInit(): void {
    this.teacherData();
    this.departmentService.getDepartmentsList().subscribe((res) => {
      this.departmentData = res;
    });
  }

  createSubject(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      credit: ['', [Validators.required, Validators.pattern('^[0-9]+(?:\\.[0-9]+)?$')]],
      code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      teacher: ['', Validators.required]
    });
  }

  get subjects(): FormArray {
    return this.enrollmentForm.get('subjects') as FormArray;
  }

  addSubject(): void {
    this.subjects.push(this.createSubject());
  }

  getSubjectControl(index: number, controlName: string): any {
    return (this.subjects.at(index) as FormGroup).get(controlName);
  }

  removeSubject(index: number): void {
    if (this.subjects.length > 1) {
      const subjectCode = this.subjects.at(index).get('code')?.value;

      if (!this.currentEnrollmentId) {
        alertify.error('Select an enrollment to edit before deleting subjects');
        return;
      }

      if (subjectCode) {
        this.enrollmentService.deleteSubjectFromEnrollment(this.currentEnrollmentId, subjectCode).subscribe(
          () => {
            this.subjects.removeAt(index);
          },
          () => alertify.error('Failed to delete subject')
        );
      } else {
        this.subjects.removeAt(index);
      }
    } else {
      alertify.error('At least one subject is required.');
    }
  }

  submitForm(): void {
    if (this.enrollmentForm.valid) {
      const enrollmentData = this.enrollmentForm.value;

      // ❗️ Validation: Prevent assigning same teacher to multiple subjects in one semester
      const teacherSet = new Set();
      const duplicateTeacher = this.subjects.controls.some(subject => {
        const teacher = subject.get('teacher')?.value;
        if (teacherSet.has(teacher)) {
          return true;
        } else {
          teacherSet.add(teacher);
          return false;
        }
      });

      if (duplicateTeacher) {
        alertify.error('Each teacher can only be assigned to one subject per semester.');
        return;
      }

      if (this.editMode && this.currentEnrollmentId) {
        this.enrollmentService.UpdateEnrollmentData(this.currentEnrollmentId, enrollmentData).subscribe(
          () => {
            alertify.success('Enrollment updated successfully');
            this.resetForm();
            this.getEnrollmentList();
          },
          () => alertify.error('Failed to update enrollment')
        );
      } else {
        this.enrollmentService.postEnrollment(enrollmentData).subscribe(
          () => {
            alertify.success('Enrollment added successfully');
            this.resetForm();
            this.getEnrollmentList();
          },
          (error) => {
            console.error('Enrollment error:', error);
            alertify.error(error.error?.message || 'Failed to add enrollment');
          }
        );
      }
    } else {
      alertify.error('Form is invalid');
    }
  }

  teacherData(): void {
    this.userService.getTeacherData().subscribe(
      (res) => {
        this.showTeacherData = res.faculty || [];
        this.getEnrollmentList();
      },
      (err) => console.error('Error fetching teachers', err)
    );
  }

  getEnrollmentList() {
    this.enrollmentService.getEnrollmentData().subscribe((res) => {
      this.listData = res;

      // Replace teacher emails with names for display
      this.listData.forEach(enroll => {
        enroll.subjects.forEach((subject: any) => {
          const teacher = this.showTeacherData.find(t => t.email === subject.teacher);
          if (teacher) {
            subject.teacher = teacher.name;
          }
        });
      });
    });
  }

  async deleteEnrollData(enrollId: string) {
    const confirmed = await this.showConfirmationPopup();
    if (confirmed) {
      this.enrollmentService.delEnrollmentList(enrollId).subscribe(
        () => {
          this.getEnrollmentList();
          this.confirmationService.showSuccessMessage('Enrollment deleted successfully');
        },
        () => this.confirmationService.showErrorMessage('Failed to delete enrollment')
      );
    }
  }

  editEnrollment(enrollment: any): void {
    this.editMode = true;
    this.currentEnrollmentId = enrollment._id;

    this.enrollmentForm.patchValue({
      enrollmentKey: enrollment.enrollment_key,
      semester: enrollment.semester,
      department: enrollment.department
    });

    this.subjects.clear();

    enrollment.subjects.forEach((subject: any) => {
      this.subjects.push(
        this.formBuilder.group({
          name: [subject.name, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
          credit: [subject.credit, [Validators.required, Validators.pattern('^[0-9]+(?:\\.[0-9]+)?$')]],
          code: [subject.code, [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
          teacher: [subject.teacher, Validators.required]
        })
      );
    });
  }

  showConfirmationPopup(): Promise<boolean> {
    return new Promise((resolve) => {
      alertify.confirm(
        'Confirmation',
        'Are you sure you want to delete?',
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  resetForm(): void {
    this.enrollmentForm.reset();
    this.subjects.clear();
    this.subjects.push(this.createSubject());
    this.editMode = false;
    this.currentEnrollmentId = null;
  }
}
