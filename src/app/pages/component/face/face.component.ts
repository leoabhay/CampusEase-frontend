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
  enrolledSubjects: { name: string; code: string }[] = []; // To hold enrolled subjects for dropdown
  webcamImage: WebcamImage | null = null;
  trigger: Subject<void> = new Subject<void>();
  loading = false;

  userRole: 'student' | 'faculty' | 'admin' = 'student';
  searchRollno: number | null = null;
  attendanceList: any[] = [];
  selectedImageId: string | null = null;
  subjectsPopulated = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  const token = localStorage.getItem('userToken');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));

    this.userRole = payload.role;

    if (this.userRole === 'student' && payload.rollno) {
      this.searchRollno = payload.rollno;
      this.fetchEnrolledSubjects(); // fetch subjects for dropdown
      this.fetchAttendanceByRollno(); // Fetch student's attendance automatically

    } else if (this.userRole === 'faculty') {
      this.fetchEnrolledSubjects(); // Optional: if you want faculty to see subject dropdown too
      this.fetchAttendanceForMySubjects(); // ✅ NEW: Fetch only for their subjects

    } else if (this.userRole === 'admin') {
      this.fetchAllAttendance(); // ✅ Admin gets full access
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
      alert('Please select subject and capture your face');
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

fetchEnrolledSubjects(): void {
  const token = localStorage.getItem('userToken');
  if (!token) {
    console.warn('No user token found');
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  this.http.get<{ subjects: { name: string; code: string }[] }>('http://localhost:3200/enrollmentDatabyEmail', { headers }).subscribe({
    next: (res) => {
      if (res && res.subjects) {
        this.enrolledSubjects = res.subjects;
        // if (this.enrolledSubjects.length > 0) {
        //   this.subjectName = this.enrolledSubjects[0].name;

      }
    },
    error: (err) => {
      console.error('Failed to fetch enrolled subjects:', err);
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
      Authorization: `Bearer ${token}`,
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

  toggleImage(recordId: string): void {
    if (this.selectedImageId === recordId) {
      this.selectedImageId = null;
    } else {
      this.selectedImageId = recordId;
    }
  }

  viewImageInNewTab(imageDataUrl: string, rollno: string | number): void {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
      <html>
      <head>
        <title>Captured Face - Roll No: ${rollno}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
            background-color: #f5f9fb;
            color: #333;
          }
          h1 {
            color: #176B87;
            margin-bottom: 20px;
            font-weight: 700;
          }
          img {
            max-width: 90%;
            border: 4px solid #176B87;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(23, 107, 135, 0.3);
          }
          a.download-link {
            display: inline-block;
            margin-top: 25px;
            padding: 10px 20px;
            background-color: #176B87;
            color: #fff;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(23, 107, 135, 0.4);
            transition: background-color 0.3s ease;
          }
          a.download-link:hover {
            background-color: #145a6a;
          }
          i.fas {
            margin-right: 8px;
          }
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <h1>Captured Face</h1>
        <img src="${imageDataUrl}" alt="Captured Face" />
        <br />
        <a href="${imageDataUrl}" download="attendance-photo ${rollno}.jpg" class="download-link">
          <i class="fas fa-download"></i> Download Image
        </a>
      </body>
      </html>
    `);
      newTab.document.close();
    }
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
  populateSubjects() {
  if (!this.subjectsPopulated) {
    this.subjectsPopulated = true;
  }
}
fetchAttendanceForMySubjects(): void {
  const token = localStorage.getItem('userToken');
  if (!token) {
    console.warn('No user token found');
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  this.loading = true;
  this.http
    .get<any[]>('http://localhost:3200/getFaceAttendanceForMySubjects', { headers })
    .subscribe({
      next: (res) => {
        this.attendanceList = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching subject-specific attendance:', err);
        this.loading = false;
        alert('Failed to fetch attendance for your subjects');
      },
    });
}

}
