import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  searchTerm: string = '';
  role: string = 'student'; // default search role
  userData: any = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  searchUsers() {
    if (!this.searchTerm.trim()) {
      this.errorMessage = 'Please enter a name or email to search.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.userData = null;

    const params = new HttpParams()
      .set('name', this.searchTerm)
      .set('rollno', this.searchTerm)
      .set('email', this.searchTerm);

    const endpoint = `http://localhost:3200/${this.role}/search`;

    this.http.get<any>(endpoint, { params }).subscribe({
      next: (response) => {
        this.userData = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred while searching.';
        this.loading = false;
      }
    });
  }
}
