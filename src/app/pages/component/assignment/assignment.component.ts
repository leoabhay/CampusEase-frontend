import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment-service/assignment.service';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { NgxPaginationModule } from 'ngx-pagination'; // Import ngx-pagination module
import { PopUpService } from '../../../core/popup/pop-up.service';


@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NgxPaginationModule],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css'
})
export class AssignmentComponent {
  assignmentForm!: FormGroup;
  showAssignmentAnswer: any[] = [];
  showAssignmentQuestion: any[] = [];
  subjectList: any[] = [];
  showAssignmentsByEnrolledSubjects: any[] = [];
  filteredAssignments: any[] = [];
  uniqueSubjects: string[] = [];
  showassignmentsbyemail: any[] = [];

  p1: number = 1; 
  p2: number = 1;




  constructor(private formBuilder: FormBuilder, private assigmentService: AssignmentService,
    private enrollmentService: EnrollmentService,private conformationService:PopUpService
  ) {
  }
  ngOnInit(): void {
    this.assignmentForm = this.formBuilder.group({
      subject: ['', Validators.required],
      assignment: ['', Validators.required],
      assignmentFile: ['', Validators.required],
      submitteddate:['']
    });
    this.assignmentForm.get('subject')?.valueChanges.subscribe(selectedSubject => {
      this.filterAssignmentsBySubject(selectedSubject);
    });
    this.showData();
    this.getAssignmentQuestion();
    this.getSubjectList();
    this.getAssignmentsByEnrolledSubjectsFunction();
    this.getassignmentsbyemailFunction();
  }

  onSubmit(): void {
    if (this.assignmentForm.valid) {
      const formData = new FormData();
      formData.append('subject', this.assignmentForm.get('subject')!.value);
      formData.append('assignment', this.assignmentForm.get('assignment')!.value);
      formData.append('assignmentFile', this.assignmentForm.get('assignmentFile')!.value);
      formData.append('submitteddate', this.assignmentForm.get('submitteddate')!.value);
      
      this.assigmentService.postAnswerAssignment(formData).subscribe(
        res => {
          console.log('Assignment submitted successfully:', res);
          this.assignmentForm.reset();
          this.clearFileInput();
          this.getassignmentsbyemailFunction();

        },
        error => {
          console.error('Error submitting assignment:', error);
          this.getassignmentsbyemailFunction();
          if (error.error && error.error.message) {
            this.conformationService.showErrorMessage(error.error.message);
            this.assignmentForm.reset(); 
            this.clearFileInput();

          } else {
            this.conformationService.showErrorMessage('Error submitting assignment');
            this.assignmentForm.reset();
            this.clearFileInput(); 
          }

        }
      );
    }
  }
  clearFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  
  }
  calculateStatusForAssignments(): void {
    // Example logic to determine status (you can adjust this based on your criteria)
    const today = new Date(); // Current date
    this.showassignmentsbyemail.forEach(assignment => {
      const dueDate = new Date(assignment.dueDate); // Assuming assignment.dueDate is a Date object or string
      if (assignment.submissionDate <= dueDate) {
        assignment.status = 'Submitted on Time';
      } else {
        assignment.status = 'Submitted Late';
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.assignmentForm.patchValue({
        assignmentFile: file
      });
    }
  }
  showData() {
    this.assigmentService.getAnswerAssignment().subscribe((res) => {
      console.log(res);
      this.showAssignmentAnswer = res;
      debugger
    })
  }

  getFileName(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }

  getSubjectList() {
    this.enrollmentService.getSubjectDataList().subscribe((res) => {
      console.log(res);
      this.subjectList = res.subjects;
      debugger
    })
  }
  getAssignmentQuestion() {
    this.assigmentService.getGiveAssignment().subscribe((res) => {
      console.log(res);
      this.showAssignmentQuestion = res
    })
  }
  getAssignmentsByEnrolledSubjectsFunction() {
    this.assigmentService.getAssignmentsByEnrolledSubjects().subscribe((res) => {
      console.log(res);
      this.showAssignmentsByEnrolledSubjects = res.assignments
      this.uniqueSubjects = this.getUniqueSubjects(this.showAssignmentsByEnrolledSubjects);
      this.filterAssignmentsBySubject(this.assignmentForm.get('subject')?.value);


    })
  }
  filterAssignmentsBySubject(subject: string) {
    if (!subject) {
      this.filteredAssignments = [];
    } else {
      this.filteredAssignments = this.showAssignmentsByEnrolledSubjects.filter(item => item.subject === subject);
    }
  }
  getUniqueSubjects(assignments: any[]): string[] {
    const subjectsSet = new Set<string>();
    assignments.forEach(item => subjectsSet.add(item.subject));
    return Array.from(subjectsSet);
  }
  getassignmentsbyemailFunction() {
    this.assigmentService.getassignmentsbyemailStudent().subscribe((res: any) => {
      console.log(res);
      this.showassignmentsbyemail = res.Assignment;
      debugger;
    }, error => {
      console.error('Error retrieving assignments:', error);
    });
  }
  
}
function clearFileInput() {
  throw new Error('Function not implemented.');
}

