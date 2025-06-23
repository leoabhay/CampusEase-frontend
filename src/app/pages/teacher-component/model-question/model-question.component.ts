import { Component, OnInit } from '@angular/core';
import { ModelQuestionService } from '../../../core/services/model-service/model-question.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { AssignmentService } from '../../../core/services/assignment-service/assignment.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-model-question',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgxPaginationModule,FormsModule],
  templateUrl: './model-question.component.html',
  styleUrl: './model-question.component.css'
})
export class ModelQuestionComponent implements OnInit {
  userRole: string | null | undefined;
  modelQuestionList:any[]=[]
  modelQuestionForm!: FormGroup;
  subjectList: any[] = [];
  assignmentList:any[]=[]
  currentPage = 1;

  searchTerm: string = '';

  getQuestionsByEnrolledSubjectData: any[] = [];
  filteredQuestions: any[] = [];

  // getQuestionsByEnrolledSubjectData:any[]=[]
constructor(private modelService:ModelQuestionService, private confirmationService: PopUpService,
  private enrollmentService: EnrollmentService,private assignmentService: AssignmentService,private formBuilder: FormBuilder

){
  this.userRole = localStorage.getItem('userRole')
  this.getQuestionsByEnrolledSubjectFunction()
}
  ngOnInit(): void {

    this.modelQuestionForm = this.formBuilder.group({
      subject: ['', Validators.required],
      model_question: ['', Validators.required],
      file:  ['', Validators.required],
    });

    this.getSubjectList();
    this.showAssignmentList();
    this.showModelQuestionList();
  }
  getQuestionsByEnrolledSubjectFunction(){
    this.modelService.getQuestionsByEnrolledSubjectAPI().subscribe((res)=>{
      console.log(res);
      this.getQuestionsByEnrolledSubjectData=res.Model_Questions
      this.filteredQuestions = res.Model_Questions;

    })
  }
  searchQuestions() {
    this.filteredQuestions = this.getQuestionsByEnrolledSubjectData.filter(item =>
      item.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSubmitQuestion(): void {
    if (this.modelQuestionForm.valid) {
      const formData = new FormData();
      formData.append('subject', this.modelQuestionForm.get('subject')!.value);
      formData.append('model_question', this.modelQuestionForm.get('model_question')!.value);
      formData.append('file', this.modelQuestionForm.get('file')!.value);

      this.modelService.postModelQuestion(formData).subscribe(
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
  onFileChangeQuestion(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.modelQuestionForm.patchValue({
        file: file
      });
    }
  }
  showModelQuestionList() {
    this.modelService.getModelQuestion().subscribe((res) => {
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
  showAssignmentList() {
    this.assignmentService.getGiveAssignment().subscribe((res) => {
      console.log(res);
      this.assignmentList=res
    })
  }
}
