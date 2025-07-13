import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Component Imports
import { SemesterEnrollComponent } from '../../../pages/component/semester-enroll/semester-enroll.component';
import { AcademicRecordsComponent } from '../../../pages/component/academic-records/academic-records.component';
import { AttendanceRecordComponent } from '../../../pages/component/attendance-record/attendance-record.component';
import { CourseEnrollComponent } from '../../../pages/component/course-enroll/course-enroll.component';
import { DiscussionComponent } from '../../../pages/component/discussion/discussion.component';
import { FeedbackComponent } from '../../../pages/component/feedback/feedback.component';
import { IdCardComponent } from '../../../pages/component/id-card/id-card.component';
import { JoinClubsComponent } from '../../../pages/component/join-clubs/join-clubs.component';
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
import { EventsComponent } from '../../../pages/component/events/events.component';
import { DepartmentComponent } from '../../../pages/component/department/department.component';
import { OurCourseComponent } from '../../../pages/component/our-course/our-course.component';
import { StudentDetailsComponent } from '../../../pages/component/user-details/user-details.component';
import { PaymentComponent } from '../../../pages/component/payment/payment.component';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { ChatComponent } from '../../../pages/component/chat/chat.component';
import { AdminCvListComponent } from '../../../pages/admin-component/admin-cv-list/admin-cv-list.component';
import { StudentFeeComponent } from '../../../pages/component/student-fee/student-fee.component';
import { AdminFeeComponent } from '../../../pages/admin-component/admin-fee/admin-fee.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatComponent,
    SemesterEnrollComponent,
    AcademicRecordsComponent,
    AttendanceRecordComponent,
    CourseEnrollComponent,
    DiscussionComponent,
    FeedbackComponent,
    IdCardComponent,
    JoinClubsComponent,
    SponsorshipComponent,
    AssignmentComponent,
    AssignmentMaterialsComponent,
    CourseRecordComponent,
    InternalRecordsComponent,
    ModelQuestionComponent,
    StudentWorkComponent,
    UserManagementComponent,
    EnrollmentKeyComponent,
    ProfileComponent,
    JobVacancyComponent,
    ListCourseComponent,
    EventsComponent,
    DepartmentComponent,
    OurCourseComponent,
    StudentDetailsComponent,
    PaymentComponent,
    AdminCvListComponent,
    StudentFeeComponent,
    AdminFeeComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentSection: string = 'basic';
  showUserProfileData: any = null;
  userRole: string | null | undefined;
  searchQuery!: string;
  searchResults: any;
  isDarkTheme: boolean = false;

  constructor(
    private router: Router,
    private userService: UserAuthService,
    private http: HttpClient
  ) {
    this.userService.getuserDataLogin().subscribe((res) => {
      this.showUserProfileData = res.data;
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');

    // Load currentSection
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection) {
      this.currentSection = savedSection;
    } else {
      this.currentSection = this.userRole === 'admin' ? 'user-management' : 'profile';
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-mode');
    }
  }

  showSection(section: string): void {
    this.currentSection = section;
    localStorage.setItem('currentSection', section);
  }

  toggleTheme(event: any): void {
    this.isDarkTheme = event.target.checked;

    if (this.isDarkTheme) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  LogoutButton(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
