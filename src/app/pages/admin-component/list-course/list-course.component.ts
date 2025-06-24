import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { CommonModule } from '@angular/common';
import * as alertify from 'alertifyjs';
import { PopUpService } from '../../../core/popup/pop-up.service';

@Component({
  selector: 'app-list-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-course.component.html',
  styleUrl: './list-course.component.css'
})
export class ListCourseComponent {
  listData: any[] = [];

  constructor(
    private http: HttpClient,
    private courseListService: EnrollmentService,
    private confirmationService: PopUpService
  ) {
    this.getEnrollmentList();
  }

  getEnrollmentList() {
    this.courseListService.getEnrollmentData().subscribe((res) => {
      console.log(res);
      this.listData = res;
      console.log(this.listData);
      debugger;
    });
  }

  async deleteEnrollData(enrollId: string) {
    const confirmed = await this.showConfirmationPopup();
    if (confirmed) {
      this.courseListService.delEnrollmentList(enrollId).subscribe((res) => {
        console.log(res);
        this.getEnrollmentList();
        this.confirmationService.showSuccessMessage('Enrollment deleted successfully');
      }, () => {
        this.confirmationService.showErrorMessage('Failed to delete enrollment');
      });
    }
  }

  showConfirmationPopup(): Promise<boolean> {
    return new Promise((resolve) => {
      alertify.confirm(
        'Confirmation',
        'Are you sure you want to delete this enrollment?',
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  }

  async deleteSubject(enrollmentId: string, subjectCode: string): Promise<void> {
    const confirmed = await this.showConfirmationPopup();
    if (!confirmed) {
      this.confirmationService.showErrorMessage('Sorry, cannot be deleted');
      return;
    }

    // Find the enrollment in the listData
    const enrollment = this.listData.find(enroll => enroll._id === enrollmentId);

    if (!enrollment) {
      this.confirmationService.showErrorMessage('Enrollment not found');
      return;
    }

    const subjectCount = enrollment.subjects.length;

    if (subjectCount === 1) {
      // Only one subject, delete the whole enrollment
      this.courseListService.delEnrollmentList(enrollmentId).subscribe(
        () => {
          this.getEnrollmentList();
          this.confirmationService.showSuccessMessage('Enrollment deleted successfully');
        },
        () => {
          this.confirmationService.showErrorMessage('Failed to delete enrollment');
        }
      );
    } else {
      // More than one subject, delete only the subject
      this.courseListService.deleteSubjectFromEnrollment(enrollmentId, subjectCode).subscribe(
        () => {
          this.getEnrollmentList();
          this.confirmationService.showSuccessMessage('Subject deleted successfully');
        },
        () => {
          this.confirmationService.showErrorMessage('Failed to delete subject');
        }
      );
    }
  }
}
