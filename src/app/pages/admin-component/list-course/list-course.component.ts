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

  // Fetch all enrollment data
  getEnrollmentList() {
    this.courseListService.getEnrollmentData().subscribe((res) => {
      console.log('Fetched enrollments:', res);
      this.listData = res;
    });
  }

  // Delete full enrollment
  async deleteEnrollData(enrollId: string) {
    const confirmed = await this.showConfirmationPopup();
    if (confirmed) {
      this.courseListService.delEnrollmentList(enrollId).subscribe(
        (res) => {
          console.log('Deleted enrollment:', res);
          this.getEnrollmentList();
          this.confirmationService.showSuccessMessage('Enrollment deleted successfully');
        },
        () => {
          this.confirmationService.showErrorMessage('Failed to delete enrollment');
        }
      );
    }
  }

  // Confirmation dialog using alertify
  showConfirmationPopup(): Promise<boolean> {
    return new Promise((resolve) => {
      alertify.confirm(
        'Confirmation',
        'Are you sure you want to delete this enrollment?',
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  // Delete a single subject or full enrollment if it's the last subject
  async deleteSubject(enrollmentId: string, subjectCode: string): Promise<void> {
    const confirmed = await this.showConfirmationPopup();
    if (!confirmed) {
      this.confirmationService.showErrorMessage('Sorry, cannot be deleted');
      return;
    }

    const enrollment = this.listData.find(enroll => enroll._id === enrollmentId);

    if (!enrollment) {
      this.confirmationService.showErrorMessage('Enrollment not found');
      return;
    }

    const subjectCount = enrollment.subjects?.length || 0;

    if (subjectCount === 1) {
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

  // Update enrollment by ID with dummy data (replace this with form-based values)
  // updateEnrollment(enrollmentId: string): void {
  //   const updatedData = {
  //     semester: 6,
  //     section: 'B',
  //     subjects: ['CS101', 'MA201', 'PHY303']
  //   };

  //   this.courseListService.UpdateEnrollmentData(enrollmentId, updatedData).subscribe(
  //     (res) => {
  //       console.log('Enrollment updated:', res);
  //       this.getEnrollmentList();
  //       this.confirmationService.showSuccessMessage('Enrollment updated successfully');
  //     },
  //     (err) => {
  //       console.error('Update failed:', err);
  //       this.confirmationService.showErrorMessage('Failed to update enrollment');
  //     }
  //   );
  // }
}
