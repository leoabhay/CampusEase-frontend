import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-our-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-course.component.html',
  styleUrl: './our-course.component.css'
})
export class OurCourseComponent implements OnInit {
  listData: any[] = [];
  userRole: string | null | undefined;
  subjectList: any[] = []
  constructor(private http: HttpClient, private courseListService: EnrollmentService,
    private enrollmentService: EnrollmentService
  ) {
    this.userRole = localStorage.getItem('userRole')
    this.getCoursetList();
  }
  getCoursetList() {
    this.courseListService.getEnrollmentData().subscribe((res) => {
      console.log(res);
      this.listData = res
      console.log(this.listData);
      debugger
    })
  }

  ngOnInit(): void {
    this.getSubjectList()

  }




getSubjectList(){
  this.enrollmentService.getSubjectDataList().subscribe((res) => {
    console.log(res);
    this.subjectList = res.subjects;
  })
}

}
