import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as alertify from 'alertifyjs';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-semester-enroll',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './semester-enroll.component.html',
  styleUrl: './semester-enroll.component.css'
})
export class SemesterEnrollComponent implements OnInit{
  enrollmentKeyForm!:FormGroup
  completedSemesterForm!:FormGroup
  subject:any[]=[];
  enrollmentData: any;
  email:string='';
  subjectNotFound: boolean = false;
  options = [
    'A', 'A-', 'B-', 'B', 'B+', 'C+', 'C', 'C-', 'D', 'D+'
  ];
constructor(private formBuilder:FormBuilder, private enrollmentService:EnrollmentService){
  this.enrollSubject();
  this.semSubject()
  
}

ngOnInit(): void {
  this.enrollmentKeyForm= this.formBuilder.group({
    enrollment_key :['', Validators.required],
    userEmail:['']
  })

}
enrollSubject(){
  console.log(this.subject);
  debugger
}
enrollButton(){
  const token = localStorage.getItem('token'); 

  if(this.enrollmentKeyForm.valid){
    console.log(this.enrollmentKeyForm.value);
    this.enrollmentService.postEnrollmentJoin(this.enrollmentKeyForm.value).subscribe((res)=>{
      if(res.matchEnrollmentKey){
      
        alertify.success('Enrollment key added ')
        this.semSubject()
        debugger
      }
      else{
        alertify.error('Enrollment key Doesnot Found')
      }
    })
  }
  else{
    alertify.error('Please enter the valid Enrollment Key')
  }
}
semSubject() {
  this.enrollmentService.getEnrollmentDataByEmail().subscribe(
    (data) => {
      this.enrollmentData = data;
      this.subjectNotFound = false;
    },
    (error) => {
      if (error.error.message === "subject not found") {
        this.subjectNotFound = true;
      } else {
        console.error('Error fetching enrollment data:', error);
      }
    }
  );
}

// initializeForm(): void {
//   if (this.enrollmentData && this.enrollmentData.subjects) {
//     const formControls = this.enrollmentData.subjects.map((subject: any) =>
//       this.formBuilder.group({
//         name: [{ value: subject.name, disabled: true }],
//         grade: ['', Validators.required]
//       })
//     );

//     this.completedSemesterForm = this.formBuilder.group({
//       subjects: this.formBuilder.array(formControls)
//     });
//   } else {
//     console.error('Enrollment data or subjects are missing:', this.enrollmentData);
//     alertify.error('Enrollment data or subjects are missing');
//   }
// }
deleteEnrollment() {
  this.enrollmentService.deleteEnrollmentData().subscribe(
    (response) => {
      alert('Enrolled subject deleted successfully');
      this.semSubject()
    },
    (error) => {
      console.error('Error deleting enrollment data:', error);
      alert('Error deleting enrollment data');
    }
  );
}
saveTarget(): void {
  if (this.completedSemesterForm) {
    if (this.completedSemesterForm.valid) {
      console.log('Form values:', this.completedSemesterForm.value);
      alert('Form is valid. Values saved to console.');
      // You can perform further actions like sending data to backend, etc.
    } else {
      console.warn('Form is not valid:', this.completedSemesterForm.errors);
      alert('Form is not valid. Please fill all required fields.');
    }
  } else {
    console.error('Completed Semester Form is not initialized or null:', this.completedSemesterForm);
    alert('Form is not initialized or null. Please check the form initialization.');
  }
}
}