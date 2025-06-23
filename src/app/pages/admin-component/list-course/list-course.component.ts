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
  listData: any[] = []
  constructor(private http: HttpClient, private courseListService: EnrollmentService,
    private confirmationService:PopUpService

  ) {
    this.getEnrollmentList();
  }
  getEnrollmentList() {
    this.courseListService.getEnrollmentData().subscribe((res) => {
      console.log(res);
      this.listData = res
      console.log(this.listData);
      debugger
    })
  }
  async deleteEnrollData(enrollId: string) {

    const confirmed = this.showConfirmationPopup();
    if (await confirmed) {
      this.courseListService.delEnrollmentList(enrollId).subscribe((res) => {
        console.log(res);
        this.getEnrollmentList();
      });
    }
  }
  showConfirmationPopup(): Promise<boolean> {
    return new Promise((resolve) => {
      alertify.confirm('Confirmation', 'Are you sure you want to delete this enrollment?', () => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    });
  }
  async deleteSubject(enrollmentId: string, subjectCode: string): Promise<void> {
    const confirmed = this.showConfirmationPopup();
    if (await confirmed) {

      this.courseListService.deleteSubjectFromEnrollment(enrollmentId, subjectCode).subscribe((res) => {
        console.log(res);
        this.getEnrollmentList();
        this.confirmationService.showSuccessMessage('Delete Sucessfully')

      })
    }
    else{
      this.confirmationService.showErrorMessage('Sorry Cannnot be Deleted')
    }
  }



}
