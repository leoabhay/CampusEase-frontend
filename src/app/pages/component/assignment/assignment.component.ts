import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment-service/assignment.service';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopUpService } from '../../../core/popup/pop-up.service';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxPaginationModule],
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

  editMode: boolean = false;
  editingAssignmentId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private assigmentService: AssignmentService,
    private enrollmentService: EnrollmentService,
    private conformationService: PopUpService
  ) {}

  ngOnInit(): void {
    this.assignmentForm = this.formBuilder.group({
      subject: ['', Validators.required],
      assignment: ['', Validators.required],
      assignmentFile: ['', Validators.required],
      submitteddate: ['']
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

    if (this.editMode) {
      this.assigmentService.updateAnswerAssignment(this.editingAssignmentId, formData).subscribe(
        res => {
          this.conformationService.showSuccessMessage("Assignment updated successfully!");
          this.conformationService.showSuccessMessage("Assignment submitted");  // <-- Added here
          this.assignmentForm.reset();
          this.clearFileInput();
          this.editMode = false;
          this.getassignmentsbyemailFunction();
        },
        error => {
          console.error('Error updating assignment:', error);
          this.conformationService.showErrorMessage("Failed to update assignment.");
        }
      );
    } else {
      this.assigmentService.postAnswerAssignment(formData).subscribe(
        res => {
          this.conformationService.showSuccessMessage("Assignment submitted");  // <-- Added here
          this.assignmentForm.reset();
          this.clearFileInput();
          this.getassignmentsbyemailFunction();
        },
        error => {
          this.conformationService.showErrorMessage(
            error?.error?.message || 'Error submitting assignment'
          );
          this.assignmentForm.reset();
          this.clearFileInput();
        }
      );
    }
  }
}

  clearFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  calculateStatusForAssignments(): void {
    const today = new Date();
    this.showassignmentsbyemail.forEach(assignment => {
      const dueDate = new Date(assignment.dueDate);
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
    const allowedTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ];

    if (!allowedTypes.includes(file.type)) {
      this.conformationService.showErrorMessage('Invalid file type. Allowed: PDF, DOC, DOCX, XLSX');
      // Clear file input
      event.target.value = '';
      this.assignmentForm.patchValue({ assignmentFile: null });
      return;
    }

    // Valid file
    this.assignmentForm.patchValue({
      assignmentFile: file
    });
  }
}

  showData() {
    this.assigmentService.getAnswerAssignment().subscribe(res => {
      this.showAssignmentAnswer = res;
    });
  }

  getFileName(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }

  getSubjectList() {
    this.enrollmentService.getSubjectDataList().subscribe(res => {
      this.subjectList = res.subjects;
    });
  }

  getAssignmentQuestion() {
    this.assigmentService.getGiveAssignment().subscribe(res => {
      this.showAssignmentQuestion = res;
    });
  }

  getAssignmentsByEnrolledSubjectsFunction() {
    this.assigmentService.getAssignmentsByEnrolledSubjects().subscribe(res => {
      this.showAssignmentsByEnrolledSubjects = res.assignments;
      this.uniqueSubjects = this.getUniqueSubjects(this.showAssignmentsByEnrolledSubjects);
      this.filterAssignmentsBySubject(this.assignmentForm.get('subject')?.value);
    });
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
    this.assigmentService.getassignmentsbyemailStudent().subscribe(
      (res: any) => {
        this.showassignmentsbyemail = res.Assignment;
      },
      error => {
        console.error('Error retrieving assignments:', error);
      }
    );
  }

  onEditAssignment(item: any): void {
    this.assignmentForm.patchValue({
      subject: item.subject,
      assignment: item.assignment,
      submitteddate: item.submitteddate,
    });

    this.clearFileInput();
    this.editMode = true;
    this.editingAssignmentId = item._id;
    window.scrollTo(0, 0);
  }

  onDeleteAssignment(id: string): void {
    if (confirm("Are you sure you want to delete this assignment?")) {
      this.assigmentService.deleteAnswerAssignment(id).subscribe(
        res => {
          this.conformationService.showSuccessMessage("Assignment deleted!");
          this.getassignmentsbyemailFunction();
        },
        err => {
          console.error("Error deleting assignment:", err);
          this.conformationService.showErrorMessage("Failed to delete assignment.");
        }
      );
    }
  }
}
