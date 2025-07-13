import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department-service/department.service';
import * as alertify from 'alertifyjs';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {
  createFacultyForm!: FormGroup;
  departmentList: any[] = [];
  showTeacherData: any[] = []
  isEditMode: boolean = false;
  facultyId: string | null = null;

  constructor(private formBuilder: FormBuilder, private departmentService: DepartmentService,
    private userService: UserAuthService,
    private confirmationService: PopUpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.teacherData()
  }
  ngOnInit(): void {
    this.facultyId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.facultyId;


    this.facultyFormData();
    this.showDepartmentList();
  }

  facultyFormData() {
    this.createFacultyForm = this.formBuilder.group({
      createFaculty: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$')
      ]],
      hod: ['', Validators.required]
    })
  }
  createFaculty(): void {
  if (this.createFacultyForm.valid) {
    if (this.isEditMode && this.facultyId) {
      this.departmentService.updateDepartment(this.facultyId, this.createFacultyForm.value).subscribe(res => {
        alertify.success("Faculty updated");
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/your-current-route']);
        });
      }, error => {
        console.error('Error updating faculty:', error);
        alertify.error("Error updating faculty");
      });
    } else {
      this.departmentService.postDepartmentsList(this.createFacultyForm.value).subscribe(
        (response) => {
          alertify.success('Faculty created successfully');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/your-current-route']);
          });
        },
        (error) => {
          if (error.error?.message) {
            alertify.error(error.error.message);
          } else {
            alertify.error('Something went wrong');
          }
        }
      );
    }
  } else {
    alertify.error('Please fill in all fields correctly');
  }
}

  showDepartmentList() {
    this.departmentService.getDepartmentsList().subscribe((res) => {
      console.log(res);
      this.departmentList = res
      debugger
    })
  }
  editDepartment(departmentId: string) {
    console.log('Edit department with ID:', departmentId);
    this.departmentService.getDepartmentsListById(departmentId).subscribe(data => {
      if (!data) {
        console.error('Department not found');
        return;
      }
      this.isEditMode = true;
      this.facultyId = departmentId;
      this.createFacultyForm.patchValue({
        createFaculty: data.createFaculty,
        hod: data.hod
      });
      console.log('Form values patched:', this.createFacultyForm.value);
    });
  }

  async deleteDepartment(departmentId: string) {
  const confirmed = await this.confirmationService.showConfirmationPopup();
  if (confirmed) {
    this.departmentService.delDepartmentList(departmentId).subscribe((res) => {
      alertify.success("Department deleted");
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/department']);
      });
    });
  } else {
    this.confirmationService.showErrorMessage('Sorry cannot be deleted');
  }
}

  teacherData() {
    this.userService.getTeacherData().subscribe((res) => {
      this.showTeacherData = res.faculty
    })
  }

}
