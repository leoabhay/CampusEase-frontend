import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  searchTerm: string = '';
  studentData: any = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  searchStudents() {
    if (!this.searchTerm.trim()) {
      this.errorMessage = 'Please enter a name, roll number, or email to search.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.studentData = null;

    const params = new HttpParams()
      .set('name', this.searchTerm)
      .set('rollno', this.searchTerm)
      .set('email', this.searchTerm);

    this.http.get<any>('http://localhost:3200/students/search', { params }).subscribe({
      next: (response) => {
        this.studentData = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred while searching.';
        this.loading = false;
      }
    });
  }
}
