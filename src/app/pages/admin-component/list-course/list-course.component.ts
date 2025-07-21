import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';  // <-- import user service for teachers
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
  showTeacherData: any[] = [];  // Holds teachers with email and name

  constructor(
    private http: HttpClient,
    private courseListService: EnrollmentService,
    private userService: UserAuthService,   // <-- inject here
    private confirmationService: PopUpService
  ) {
    this.loadTeachersAndEnrollments();
  }

  // Load teachers and then enrollment list
  loadTeachersAndEnrollments() {
    this.userService.getTeacherData().subscribe((res: any) => {
      this.showTeacherData = res.faculty || [];
      this.getEnrollmentList();
    });
  }

  // Fetch all enrollment data and map teacher emails to names
  getEnrollmentList() {
    this.courseListService.getEnrollmentData().subscribe((res) => {
      this.listData = res;

      // Map teacher emails to names in subjects
      this.listData.forEach(enrollment => {
        enrollment.subjects.forEach((subject: any) => {
          const teacher = this.showTeacherData.find(t => t.email === subject.teacher);
          if (teacher) {
            subject.teacher = teacher.name;  // replace email with name
          }
        });
      });
    });
  }

  async deleteEnrollData(enrollId: string) {
    const confirmed = await this.showConfirmationPopup();
    if (confirmed) {
      this.courseListService.delEnrollmentList(enrollId).subscribe(
        (res) => {
          this.getEnrollmentList();
          this.confirmationService.showSuccessMessage('Enrollment deleted successfully');
        },
        () => {
          this.confirmationService.showErrorMessage('Failed to delete enrollment');
        }
      );
    }
  }

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
}
