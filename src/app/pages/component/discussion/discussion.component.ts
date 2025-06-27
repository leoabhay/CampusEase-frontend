import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiscussionService } from '../../../core/services/discussion/discussion.service';
import * as alertify from 'alertifyjs';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { PopUpService } from '../../../core/popup/pop-up.service';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private discussionService: DiscussionService
    , private confirmationService: PopUpService
  ) { }
  discussionTable!: FormGroup;
  discussionData: any[] = [];
  discussionList: any[] = [];
  userRole: string | null | undefined;
  isEditMode: boolean = false;
  discussionResultId: string | null = null;
  minDate: string | undefined;
  @ViewChild('exampleModal') editModal!: ElementRef;
  ngOnInit(): void {
    this.discussionTable = this.formBuilder.group({
      discussion_topic: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      date: ['', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]], // Ensures date is in YYYY-MM-DD format
      decision_by: [''],
      decision: ['', Validators.required],
    })
    this.getDiscissionTable();
    this.userRole = localStorage.getItem('userRole')
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.minDate = this.formatDate(minDate)

  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  addDiscussion() {
    debugger
    console.log('button is clicked');
    if (this.discussionTable.valid) {
      if (this.isEditMode && this.discussionResultId) {
        this.discussionService.updateDiscussion(this.discussionResultId, this.discussionTable.value).subscribe(res => {
          alertify.success("Notice updated");
          this.getDiscissionTable();
          this.discussionTable.reset();
          this.closeModal();
        }, error => {
          console.error('Error updating notice:', error);
          alertify.error("Error updating notice");
        });
      }
      else {
        const formData = this.discussionTable.value;
        console.log(formData);
        this.discussionService.postDiscussion(formData).subscribe(
          (res) => {
            console.log(res);
            alertify.success('Notice Added');
            this.getDiscissionTable();
            this.discussionTable.reset()
            this.closeModal();
          })
      }
    }
  }

  getDiscissionTable() {
    this.discussionService.getdiscussionData().subscribe((res: any) => {
      this.discussionData = res.discussion;
      console.log(this.discussionData);
    });

  }
  editDiscussion(discussionId: string) {
    this.discussionService.getdiscussionDataById(discussionId).subscribe((res) => {
      if (!res) {
        console.error('Notice not found');
        return;
      }

      this.isEditMode = true;
      this.discussionResultId = discussionId;
      this.discussionTable.patchValue({
        discussion_topic: res.discussion_topic,
        date: res.date,
        decision: res.decision,
        decision_by: res.decision_by
      });

      if (this.editModal) {
        this.editModal.nativeElement.classList.add('show');
        this.editModal.nativeElement.style.display = 'block';
      }
    }, error => {
      console.error('Error fetching notice data:', error);
    });
  }

  async deleteDiscussion(discussinId: string) {
    debugger
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {

      this.discussionService.deleteDiscussion(discussinId).subscribe((res) => {
        debugger
        this.confirmationService.showSuccessMessage('notice is deleted')
        this.getDiscissionTable()
      })
    }
    else {
      this.confirmationService.showErrorMessage('Sorry cannnot be Deleted')
    }
  }

  closeModal() {
    if (this.editModal) {
      this.editModal.nativeElement.classList.remove('show');
      this.editModal.nativeElement.style.display = 'none';
      this.discussionTable.reset()

    }
  }
  OpenModal() {
    if (this.editModal) {
      this.editModal.nativeElement.classList.add('show');
      this.editModal.nativeElement.style.display = 'block';
      this.discussionTable.reset();
    }
  }
}
