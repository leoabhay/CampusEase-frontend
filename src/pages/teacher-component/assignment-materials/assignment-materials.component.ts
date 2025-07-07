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
  imports: [ReactiveFormsModule, CommonModule,NgxPaginationModule],
  templateUrl: './assignment-materials.component.html',
  styleUrl: './assignment-materials.component.css'
})
export class AssignmentMaterialsComponent implements OnInit {

  assignmentForm!: FormGroup;
  modelQuestionForm!: FormGroup;
  subjectList: any[] = [];
  assignmentList:any[]=[]
  modelQuestionList:any[]=[]
  p: number = 1
  mq: number = 1

  constructor(private formBuilder: FormBuilder, private assignmentService: AssignmentService,
    private modelAssignment: ModelQuestionService, private enrollmentService: EnrollmentService,
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
      file:  ['', Validators.required],
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
  onSubmit() {
    if (this.assignmentForm.valid) {
      const formData = new FormData();
      formData.append('subject', this.assignmentForm.get('subject')!.value);
      formData.append('assignmentName', this.assignmentForm.get('assignmentName')!.value);
      formData.append('assignmentFile', this.assignmentForm.get('assignmentFile')!.value);
      formData.append('remarks', this.assignmentForm.get('remarks')!.value);
      formData.append('dueDate', this.assignmentForm.get('dueDate')!.value);

      this.assignmentService.postGiveAssignment(formData).subscribe(
        (res) => {
          console.log(res);
          this.assignmentForm.reset();
          this.confirmationService.showSuccessMessage('Added successfully');
          this.showAssignmentList();
        },
        (err) => {
          console.error(err);
          this.confirmationService.showErrorMessage('Sorry, cannot add a file');
          this.showAssignmentList();
          debugger
        }
      );
    } else {
      this.confirmationService.showErrorMessage('Please fill all required fields');
      this.showAssignmentList();
    }
  }

  showAssignmentList() {
    this.assignmentService.getGiveAssignment().subscribe((res) => {
      console.log(res);
      this.assignmentList=res
    })
  }
  showModelQuestionList() {
    this.modelAssignment.getModelQuestion().subscribe((res) => {
      console.log(res);
      this.modelQuestionList=res;
    })
  }

  


  getSubjectList() {
    this.enrollmentService.getSubjectDataList().subscribe((res) => {
      console.log(res);
      this.subjectList = res.subjects;
      debugger
    })
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
        (res) => {
          console.log(res);
          this.modelQuestionForm.reset();
          this.confirmationService.showSuccessMessage('Model question added successfully');
          this.showModelQuestionList();

        },
        (err) => {
          console.error(err);
          this.confirmationService.showErrorMessage('Cannot add model assignment');
          this.showModelQuestionList();

        }
      );
    } else {
      this.confirmationService.showErrorMessage('Please fill all required fields');
      this.showModelQuestionList();

    }
  }

}