import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import * as alertify from 'alertifyjs';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { DepartmentService } from '../../../core/services/department-service/department.service';

@Component({
  selector: 'app-enrollment-key',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment-key.component.html',
  styleUrl: './enrollment-key.component.css'
})
export class EnrollmentKeyComponent implements OnInit {
  enrollmentForm: FormGroup;
  showTeacherData: any[] = [];
  departmentData: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private enrollmentService: EnrollmentService,
    private userService: UserAuthService,
    private departmentService: DepartmentService
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
      this.departmentData = res; // Assuming res is an array received from the service
    });
  }

  getSubjectControl(index: number, controlName: string): any {
    const subjectsArray = this.enrollmentForm.get('subjects') as FormArray;
    const subjectGroup = subjectsArray.at(index) as FormGroup;
    return subjectGroup.get(controlName);
  }

  createSubject(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      credit: ['', [Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')]],
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

  submitForm(): void {
    if (this.enrollmentForm.valid) {
      console.log(this.enrollmentForm.value);
      this.enrollmentService.postEnrollment(this.enrollmentForm.value).subscribe(
        (res) => {
          if (res) {
            console.log(res);
            alertify.success('Enrollment is added');
            this.enrollmentForm.reset();
          } else {
            alertify.error('Response is empty');
          }
        },
        (error) => {
          console.error('Error submitting form:', error);
          alertify.error('Failed to submit enrollment');
        }
      );
    } else {
      alertify.error('Sorry, the form is invalid');
    }
  }

  teacherData(): void {
    this.userService.getTeacherData().subscribe(
      (res) => {
        this.showTeacherData = res.faculty; // Assuming res is an object with faculty array
      },
      (error) => {
        console.error('Error fetching teacher data:', error);
      }
    );
  }
}