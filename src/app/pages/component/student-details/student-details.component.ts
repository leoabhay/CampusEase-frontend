import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../../core/services/assignment-service/assignment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  studentId: string | null = null; // Initialize with null
  studentData: any;
  searchQuery!: string;
  searchResults: any;

  constructor(private router: Router,private http: HttpClient) {}
    ngOnInit(): void {
  
}
searchStudents() {
  if (!this.searchQuery) {
    return;
  }

  const requestBody = { query: { name: this.searchQuery } };

  this.http.post<any>('http://localhost:3200/search-student', requestBody)
    .subscribe(
      (response) => {
        this.studentData = response;
        console.log('Student Data:lkwiehfweouigheuig', this.studentData);
      },
      (error) => {
        console.error('Error searching students:', error);
        // Handle error as needed
      }
    );
}
}