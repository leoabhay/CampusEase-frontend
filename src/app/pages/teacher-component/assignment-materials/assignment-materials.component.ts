import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment-service/assignment.service';
import { ModelQuestionService } from '../../../core/services/model-service/model-question.service';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-assignment-materials',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './assignment-materials.component.html',
  styleUrl: './assignment-materials.component.css'
})
export class AssignmentMaterialsComponent implements OnInit {

  assignmentForm!: FormGroup;
  modelQuestionForm!: FormGroup;
  subjectList: any[] = [];
  assignmentList: any[] = [];
  modelQuestionList: any[] = [];
  p: number = 1;
  mq: number = 1;
  isEditing: boolean = false;
  editingAssignmentId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private assignmentService: AssignmentService,
    private modelAssignment: ModelQuestionService,
    private enrollmentService: EnrollmentService,
    private confirmationService: PopUpService,
  ) {
    this.getSubjectList();
    this.showAssignmentList();
    this.showModelQuestionList();
  }

  ngOnInit(): void {
    this.assignmentForm = this.formBuilder.group({
      subject: ['', Validators.required],
      assignmentName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      assignmentFile: ['', Validators.required],
      dueDate: [this.getFormattedDueDate(7), [Validators.required, this.dueDateValidator(7)]],
      remarks: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 .,?!]*$/)]]
    });

    this.modelQuestionForm = this.formBuilder.group({
      subject: ['', Validators.required],
      model_question: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  getFormattedDueDate(daysToAdd: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return formatDate(today, 'yyyy-MM-dd', 'en-US');
  }

  dueDateValidator(minDays: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date();
      const dueDate = new Date(control.value);
      const minDate = new Date(today.setDate(today.getDate() + minDays));
      return dueDate >= minDate ? null : { 'dueDateInvalid': true };
    };
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.assignmentForm.patchValue({
        assignmentFile: file
      });
    }
  }

  onSubmit(): void {
  if (this.assignmentForm.invalid) {
    this.confirmationService.showErrorMessage('Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('subject', this.assignmentForm.get('subject')!.value);
  formData.append('assignmentName', this.assignmentForm.get('assignmentName')!.value);
  formData.append('remarks', this.assignmentForm.get('remarks')!.value);
  formData.append('dueDate', this.assignmentForm.get('dueDate')!.value);

  // Only append file if a new one is selected
  const file = this.assignmentForm.get('assignmentFile')!.value;
  if (file && file instanceof File) {
    formData.append('assignmentFile', file);
  }

  if (this.isEditing && this.editingAssignmentId) {
    this.assignmentService.updateAssignment(this.editingAssignmentId, formData).subscribe(
      () => {
        this.confirmationService.showSuccessMessage('Assignment updated successfully');
        this.resetForm();
        this.showAssignmentList();
      },
      (err) => {
        console.error(err);
        this.confirmationService.showErrorMessage('Update failed');
      }
    );
  } else {
    this.assignmentService.postGiveAssignment(formData).subscribe(
      () => {
        this.confirmationService.showSuccessMessage('Added successfully');
        this.resetForm();
        this.showAssignmentList();
      },
      (err) => {
        console.error(err);
        this.confirmationService.showErrorMessage('Cannot add assignment');
      }
    );
  }
}


  showAssignmentList(): void {
    this.assignmentService.getGiveAssignment().subscribe((res) => {
      this.assignmentList = res;
    });
  }

  showModelQuestionList(): void {
    this.modelAssignment.getModelQuestion().subscribe((res) => {
      this.modelQuestionList = res;
    });
  }

  getSubjectList(): void {
    this.enrollmentService.getSubjectDataList().subscribe((res) => {
      this.subjectList = res.subjects;
    });
  }

  onFileChangeQuestion(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.modelQuestionForm.patchValue({
        file: file
      });
    }
  }

  onSubmitQuestion(): void {
    if (this.modelQuestionForm.valid) {
      const formData = new FormData();
      formData.append('subject', this.modelQuestionForm.get('subject')!.value);
      formData.append('model_question', this.modelQuestionForm.get('model_question')!.value);
      formData.append('file', this.modelQuestionForm.get('file')!.value);

      this.modelAssignment.postModelQuestion(formData).subscribe(
        () => {
          this.confirmationService.showSuccessMessage('Model question added successfully');
          this.modelQuestionForm.reset();
          this.showModelQuestionList();
        },
        (err) => {
          console.error(err);
          this.confirmationService.showErrorMessage('Cannot add model assignment');
        }
      );
    } else {
      this.confirmationService.showErrorMessage('Please fill all required fields');
    }
  }

  editAssignment(assignment: any): void {
    this.isEditing = true;
    this.editingAssignmentId = assignment._id;

    this.assignmentForm.patchValue({
      subject: assignment.subject,
      assignmentName: assignment.assignmentName,
      assignmentFile: '', // File input can't be prefilled
      dueDate: formatDate(assignment.dueDate, 'yyyy-MM-dd', 'en-US'),
      remarks: assignment.remarks
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteAssignment(id: string): void {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignmentService.deleteAssignment(id).subscribe(
        () => {
          this.confirmationService.showSuccessMessage('Assignment deleted successfully');
          this.showAssignmentList();
        },
        (err) => {
          console.error(err);
          this.confirmationService.showErrorMessage('Failed to delete assignment');
        }
      );
    }
  }

  resetForm(): void {
    this.assignmentForm.reset();
    this.isEditing = false;
    this.editingAssignmentId = null;
  }
}
