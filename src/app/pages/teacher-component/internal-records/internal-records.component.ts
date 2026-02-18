import { environment } from '../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface InternalMark {
  rollno: number;
  subject: string;
  assignmentMarks: number;
  attendanceMarks: number;
}

@Component({
  selector: 'app-internal-records',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './internal-records.component.html',
  styleUrls: ['./internal-records.component.css'],
})
export class InternalRecordsComponent implements OnInit {
  internalMarks: InternalMark[] = [];
  isCalculating = false;
  successMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMarks();
    setInterval(() => this.fetchMarks(), 10000);
  }

  fetchMarks(): void {
    this.http
      .get<InternalMark[]>(environment.api_url + 'internal-marks')
      .subscribe({
        next: (data) => (this.internalMarks = data),
        error: (err) => console.error('Failed to fetch internal marks', err),
      });
  }

  calculateTotal(assignment: number, attendance: number): number {
    return assignment + attendance;
  }

  recalculateInternalMarks(): void {
    this.isCalculating = true;
    this.successMessage = '';

    this.http
      .post(environment.api_url + 'calculate-internal-marks', {})
      .subscribe({
        next: () => {
          this.isCalculating = false;
          this.successMessage = 'Internal marks updated successfully.';
          this.fetchMarks();

          // Hide success message after 3 seconds
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.isCalculating = false;
          console.error('Failed to recalculate internal marks', err);
        },
      });
  }
}
