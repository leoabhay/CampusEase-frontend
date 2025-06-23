import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SemesterEnrollComponent } from '../../../pages/component/semester-enroll/semester-enroll.component';
import { AcademicRecordsComponent } from '../../../pages/component/academic-records/academic-records.component';
import { AttendanceRecordComponent } from '../../../pages/component/attendance-record/attendance-record.component';
import { CourseEnrollComponent } from '../../../pages/component/course-enroll/course-enroll.component';
import { DiscussionComponent } from '../../../pages/component/discussion/discussion.component';
import { FeedbackComponent } from '../../../pages/component/feedback/feedback.component';
import { IdCardComponent } from '../../../pages/component/id-card/id-card.component';
import { JoinClubsComponent } from '../../../pages/component/join-clubs/join-clubs.component';
import { SettingComponent } from '../../../pages/component/setting/setting.component';
import { SponsorshipComponent } from '../../../pages/component/sponsorship/sponsorship.component';
import { AssignmentComponent } from '../../../pages/component/assignment/assignment.component';
import { CourseRecordComponent } from '../../../pages/teacher-component/course-record/course-record.component';
import { InternalRecordsComponent } from '../../../pages/teacher-component/internal-records/internal-records.component';
import { ModelQuestionComponent } from '../../../pages/teacher-component/model-question/model-question.component';
import { AssignmentMaterialsComponent } from '../../../pages/teacher-component/assignment-materials/assignment-materials.component';
import { StudentWorkComponent } from '../../../pages/teacher-component/student-work/student-work.component';
import { UserManagementComponent } from '../../../pages/admin-component/user-management/user-management.component';
import { EnrollmentKeyComponent } from '../../../pages/admin-component/enrollment-key/enrollment-key.component';
import { ProfileComponent } from '../../../pages/component/profile/profile.component';
import { JobVacancyComponent } from '../../../pages/admin-component/job-vacancy/job-vacancy.component';
import { ListCourseComponent } from '../../../pages/admin-component/list-course/list-course.component';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { EventsComponent } from '../../../pages/component/events/events.component';
import { ClassScheduleComponent } from '../../../pages/component/class-schedule/class-schedule.component';
import { DepartmentComponent } from '../../../pages/component/department/department.component';
import { OurCourseComponent } from '../../../pages/component/our-course/our-course.component';
import { HttpClient } from '@angular/common/http';
import { StudentDetailsComponent } from '../../../pages/component/student-details/student-details.component';
import { PaymentComponent } from '../../../pages/component/payment/payment.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SemesterEnrollComponent,
    AcademicRecordsComponent, AttendanceRecordComponent, CourseEnrollComponent,
    DiscussionComponent, FeedbackComponent, IdCardComponent, JoinClubsComponent,
    SemesterEnrollComponent, SettingComponent, SponsorshipComponent, AssignmentComponent,
    AssignmentMaterialsComponent, CourseRecordComponent, FeedbackComponent, InternalRecordsComponent,
    ModelQuestionComponent, StudentWorkComponent, UserManagementComponent,
    EnrollmentKeyComponent, ProfileComponent, JobVacancyComponent, ListCourseComponent, EventsComponent
    , ClassScheduleComponent, DepartmentComponent, OurCourseComponent,ReactiveFormsModule,StudentDetailsComponent,PaymentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentSection: string = 'basic'
  showUserProfileData: any = null;
  userRole: string | null | undefined;
  searchQuery!: string;
  searchResults: any;

  constructor(private router: Router, private userService: UserAuthService, private http: HttpClient) {
    this.userService.getuserDataLogin().subscribe((res) => {
      this.showUserProfileData = res.data;
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');

    // Load currentSection from localStorage, fallback to 'attendance'
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection) {
      this.currentSection = savedSection;
    } else {
      this.currentSection = 'attendance';
    }
  }

  showSection(section: string): void {
    this.currentSection = section;
    // Save to localStorage on section change
    localStorage.setItem('currentSection', section);
  }

  LogoutButton() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  searchStudents() {
    if (!this.searchQuery) return;

    const requestBody = { query: { name: this.searchQuery } };

    this.http.post<any>('http://localhost:3200/search-student', requestBody).subscribe(
      (response) => {
        this.searchResults = response;
        if (this.searchResults && this.searchResults.length > 0) {
          const studentId = this.searchResults[0]._id;
          this.router.navigate(['/student', studentId]);
        } else {
          console.log('No student found.');
        }
      },
      (error) => {
        console.error('Error searching students:', error);
      }
    );
  }
}
