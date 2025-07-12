import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-admin-cv-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-cv-list.component.html',
  styleUrls: ['./admin-cv-list.component.css']
})
export class AdminCvListComponent implements OnInit {
  submissions: any[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSubmissions();
  }

  fetchSubmissions() {
    this.loading = true;
    this.http.get<any[]>(`${environment.api_url}cv-submissions`)
      .subscribe({
        next: (res) => {
          this.submissions = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load submissions.';
          console.error(err);
          this.loading = false;
        }
      });
  }

  deleteSubmission(id: string) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    this.http.delete(`${environment.api_url}cv-submissions/${id}`).subscribe({
      next: () => {
        this.submissions = this.submissions.filter(s => s._id !== id);
      },
      error: (err) => {
        alert('Failed to delete submission.');
        console.error(err);
      }
    });
  }
}
