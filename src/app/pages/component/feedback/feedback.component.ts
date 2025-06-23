import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackService } from '../../../core/services/feedback/feedback.service';
import { CommonModule } from '@angular/common';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgxPaginationModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedbackTableData: any[] = [];
  feedbackTableRoleData: any[] = [];
  pagedFeedbackTableData: any[] = [];
  currentPage = 1;
  itemsPerPage = 5; // Set items per page to 10
  totalPages = 0;
  pages: number[] = [];
  FeedbackByEmailList:any[]=[]
  showTeacherData:any[]=[]
  // currentPage = 1;


  constructor(private formBuilder: FormBuilder, private feedbackService: FeedbackService
    ,    private userService:UserAuthService,private confirmationService:PopUpService

  ) {
this.teacherData()

  }

  ngOnInit(): void {
    this.feedbackForm = this.formBuilder.group({
      feedbackBy:[''],
      feedbackGroup: ['Admin', Validators.required],
      feedbackAbout: ['', Validators.required],
      feedbackFor:['admin@gmailcom',]
    });
    this.getFeedbackList();
    this.getFeedbackByEmailList();
    this.getFeedbackbyroleData();
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const formValue = this.feedbackForm.value;
      this.feedbackService.postFeedbackData(formValue).subscribe((res: any) => {
        console.log(res);
        this.getFeedbackList();
        this.feedbackForm.reset();
        this.getFeedbackByEmailList()
      });
    }
  }

  getFeedbackList() {
    this.feedbackService.getFeedbackData().subscribe((res: any) => {
      console.log(res);
      this.feedbackTableData = res.feedbackList;
      this.calculatePagination();
    });
  }
  getFeedbackbyroleData() {
    this.feedbackService.getFeedbackbyroleData().subscribe((res: any) => {
      console.log(res);
      this.feedbackTableRoleData = res.feedbackByName;
      this.calculatePagination();
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.feedbackTableData.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.setPage(1); // Set initial page
  }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.feedbackTableData.length);
    this.pagedFeedbackTableData = this.feedbackTableData.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }
  getFeedbackByEmailList(){
    this.feedbackService.getFeedbackByEmail().subscribe((res)=>{
      console.log(res);
      this.FeedbackByEmailList=res.feedback
    })
  }
  teacherData() {
    this.userService.getTeacherData().subscribe((res) => {
      this.showTeacherData = res.faculty
    })
  }
  async deleteFeedback(feedbackId:string){
    const confirmed = await this.confirmationService.showConfirmationPopup()
    if( confirmed){

    this.feedbackService.delFeedbackClubList(feedbackId).subscribe((res)=>{
      console.log(res);
      this.getFeedbackList();
      this.getFeedbackByEmailList()
      this.confirmationService.showSuccessMessage('Feedback deleted')
    })
  }
 }
}