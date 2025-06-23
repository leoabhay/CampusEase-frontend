import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { EventService } from '../../core/services/event-service/event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../core/services/enrollment_service/enrollment.service';
import { UserAuthService } from '../../core/services/user_auth/user-auth.service';
import { ClubService } from '../../core/services/club_service/club.service';
import { DepartmentService } from '../../core/services/department-service/department.service';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './website.component.html',
  styleUrl: './website.component.css'
})
export class WebsiteComponent implements OnInit {
  eventList:any[]=[];
  showTeacherData: any[] = [];
  showTeacherCount: number = 0;
  subjectListCount: number = 0;
  showStudentData: any[] = [];
  showStudentCount: number = 0;
  showSecretaryData: any[] = [];
  showSecretaryCount: number = 0;
  constructor(private router:Router,private eventService:EventService,

    private userService: UserAuthService,
    private clubService: ClubService, private departmentService: DepartmentService,
    private enrollmentService: EnrollmentService,
  ) {
  }
  loginButton(){
    this.router.navigate(['login'])
  }
  registerButton(){
    this.router.navigate(['register'])
  }
  checkUserToken(): void {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      this.router.navigate(['/dashboard']);
    }
  }
  ngOnInit(): void {
    this.checkUserToken();
    this.getEventList();
    this.teacherData();
    this.getSubjectList()
    this.secretaryCount()
    this.studentCount()
    
  }
  getEventList(){
    this.eventService.getEventListList().subscribe((res)=>{
      console.log(res);
      this.eventList=res;
    })
  }
  studentCount(){
    this.userService.getStudentData().subscribe((res) => {
      this.showStudentCount = res.count
      this.showStudentData = res.student
    })
  }
  secretaryCount(){
    this.userService.getSecretarytData().subscribe((res) => {
      this.showSecretaryCount = res.count
      this.showSecretaryData = res.secretary
    })
  }
  teacherData() {
    this.userService.getTeacherData().subscribe((res) => {
      this.showTeacherCount = res.count
      this.showTeacherData = res.faculty
    })
  }
  getSubjectList() {
    this.enrollmentService.getSubjectDataListAll().subscribe((res) => {
      console.log(res);
      this.subjectListCount = res.count;
    })
  }
}
