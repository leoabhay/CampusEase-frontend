import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-face',
  standalone: true,
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.css'],
  imports: [CommonModule, FormsModule, WebcamModule],
})
export class FaceComponent implements OnInit {
  subjectName: string = '';
  webcamImage: WebcamImage | null = null;
  trigger: Subject<void> = new Subject<void>();
  loading = false;

  userRole: 'student' | 'faculty' | 'admin' = 'student';
  searchRollno: number | null = null;
  attendanceList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      this.userRole = payload.role;

      if (this.userRole === 'student' && payload.rollno) {
        this.searchRollno = payload.rollno;
        this.fetchAttendanceByRollno(); // Fetch student's attendance automatically
      } else if (this.userRole === 'faculty' || this.userRole === 'admin') {
        this.fetchAllAttendance(); // Fetch all attendance automatically for faculty/admin
      }
    }
  }

  // Webcam trigger
  get triggerObservable() {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  markAttendance(): void {
    if (!this.webcamImage || !this.subjectName) {
      alert('Please enter subject name and capture your face');
      return;
    }

    this.loading = true;

    this.http
      .post('http://localhost:3200/mark-attendance', {
        image: this.webcamImage.imageAsDataUrl,
        subjectName: this.subjectName,
      })
      .subscribe({
        next: (res: any) => {
          alert('Attendance marked for roll no: ' + res.rollno);
          this.loading = false;
          if (this.userRole === 'student') this.fetchAttendanceByRollno();
          else this.fetchAllAttendance(); // For faculty/admin after marking attendance
        },
        error: (err) => {
          console.error('HTTP Error Response:', err);
          let msg = 'Unknown error occurred';
          if (err.error && err.error.message) msg = err.error.message;
          else if (err.message) msg = err.message;
          alert(' Error: ' + msg);
          this.loading = false;
        },
      });
  }

  fetchAllAttendance(): void {
    this.loading = true;
    this.http.get('http://localhost:3200/getAllFaceAttendances').subscribe({
      next: (res: any) => {
        this.attendanceList = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching attendance:', err);
        this.loading = false;
      },
    });
  }

  fetchAttendanceByRollno(): void {
    if (!this.searchRollno) {
      alert('Please enter a roll number');
      return;
    }

    const token = localStorage.getItem('userToken');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.loading = true;
    this.http
      .get(`http://localhost:3200/getFaceAttendances/${this.searchRollno}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.attendanceList = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching attendance by rollno:', err);
          alert('Failed to load attendance for rollno: ' + this.searchRollno);
          this.loading = false;
        },
      });
  }

  deleteAttendance(id: string): void {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    this.http.delete(`http://localhost:3200/deleteFaceAttendance/${id}`).subscribe({
      next: () => {
        alert('🗑 Attendance record deleted successfully');
        if (this.userRole === 'admin' || this.userRole === 'faculty') {
          this.fetchAllAttendance();
        } else if (this.searchRollno) {
          this.fetchAttendanceByRollno();
        }
      },
      error: (err) => {
        console.error('Error deleting attendance:', err);
        alert('Failed to delete attendance');
      },
    });
  }
}
