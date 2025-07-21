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
  imports: [ReactiveFormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedbackTableData: any[] = [];
  feedbackTableRoleData: any[] = [];
  pagedFeedbackTableData: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  userRole: string = '';
  pages: number[] = [];
  FeedbackByEmailList: any[] = [];
  showTeacherData: any[] = [];

  // For editing
  isEditMode: boolean = false;
  editFeedbackId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private feedbackService: FeedbackService,
    private userService: UserAuthService,
    private confirmationService: PopUpService
  ) {
    this.teacherData();
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';

    this.feedbackForm = this.formBuilder.group({
      feedbackBy: [''],
      feedbackGroup: ['Teacher', Validators.required], // Default to Teacher
      feedbackAbout: ['', Validators.required],
      feedbackFor: [''] // Will be set dynamically
    });

    // Subscribe to feedbackGroup changes to update feedbackFor accordingly
    this.feedbackForm.get('feedbackGroup')?.valueChanges.subscribe(value => {
      if (value === 'Teacher') {
        if (this.showTeacherData.length > 0) {
          this.feedbackForm.patchValue({ feedbackFor: this.showTeacherData[0].email });
        } else {
          this.feedbackForm.patchValue({ feedbackFor: '' });
        }
      } else if (value === 'Admin') {
        this.feedbackForm.patchValue({ feedbackFor: 'Admin' });
      }
    });

    // Initialize feedbackFor based on initial feedbackGroup value & teacher data availability
    const initialGroup = this.feedbackForm.get('feedbackGroup')?.value;
    if (initialGroup === 'Teacher' && this.showTeacherData.length > 0) {
      this.feedbackForm.patchValue({ feedbackFor: this.showTeacherData[0].email });
    } else if (initialGroup === 'Admin') {
      this.feedbackForm.patchValue({ feedbackFor: 'Admin' });
    }

    // Fetch feedback lists depending on role
    if (this.userRole === 'admin') {
      this.getAllFeedbackList();
    } else {
      this.getFeedbackList();
      this.getFeedbackByEmailList();
      this.getFeedbackbyroleData();
    }
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      if (this.isEditMode && this.editFeedbackId) {
        this.feedbackService.updateFeedback(this.editFeedbackId, this.feedbackForm.value).subscribe({
          next: () => {
            this.confirmationService.showSuccessMessage('Feedback updated successfully');
            this.refreshFeedbackList();
            this.resetForm();
          },
          error: () => {
            this.confirmationService.showErrorMessage('Failed to update feedback');
          }
        });
      } else {
        this.feedbackService.postFeedbackData(this.feedbackForm.value).subscribe({
          next: () => {
            this.confirmationService.showSuccessMessage('Feedback added successfully');
            this.refreshFeedbackList();
            this.resetForm();
          },
          error: () => {
            this.confirmationService.showErrorMessage('Failed to add feedback');
          }
        });
      }
    }
  }

  getAllFeedbackList() {
    this.feedbackService.AllFeedbackData().subscribe((res: any) => {
      this.feedbackTableData = res.feedbackList || [];
      this.calculatePagination();
    });
  }

  getFeedbackList() {
    this.feedbackService.getFeedbackData().subscribe((res: any) => {
      this.feedbackTableData = res.feedbackList || [];
      this.calculatePagination();
    });
  }

  getFeedbackbyroleData() {
    this.feedbackService.getFeedbackbyroleData().subscribe((res: any) => {
      this.feedbackTableRoleData = res.feedbackByName || [];
      this.calculatePagination();
    });
  }

  getFeedbackByEmailList() {
    this.feedbackService.getFeedbackByEmail().subscribe((res) => {
      this.FeedbackByEmailList = res.feedback || [];
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.feedbackTableData.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.setPage(1);
  }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.feedbackTableData.length);
    this.pagedFeedbackTableData = this.feedbackTableData.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

  teacherData() {
    this.userService.getTeacherData().subscribe((res) => {
      this.showTeacherData = res.faculty || [];

      // If feedbackGroup is Teacher and feedbackFor is empty, set default
      if (this.feedbackForm.get('feedbackGroup')?.value === 'Teacher' && this.showTeacherData.length > 0) {
        this.feedbackForm.patchValue({ feedbackFor: this.showTeacherData[0].email });
      }
    });
  }

  async deleteFeedback(feedbackId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {
      this.feedbackService.delFeedbackClubList(feedbackId).subscribe(() => {
        this.confirmationService.showSuccessMessage('Feedback deleted');
        this.refreshFeedbackList();
      });
    }
  }

  editFeedback(feedback: any) {
    this.isEditMode = true;
    this.editFeedbackId = feedback._id || feedback.id || null;
    this.feedbackForm.patchValue({
      feedbackBy: feedback.feedbackBy || '',
      feedbackGroup: feedback.feedbackGroup || 'Teacher',
      feedbackAbout: feedback.feedbackAbout || '',
      feedbackFor: feedback.feedbackFor || 'admin@gmail.com'
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.isEditMode = false;
    this.editFeedbackId = null;
    this.feedbackForm.reset();
  }

  refreshFeedbackList() {
    if (this.userRole === 'admin') {
      this.getAllFeedbackList();
    } else {
      this.getFeedbackList();
      this.getFeedbackByEmailList();
      this.getFeedbackbyroleData();
    }
  }
}
