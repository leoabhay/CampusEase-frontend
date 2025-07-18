import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic.component.html',
  styleUrls: ['./academic.component.css']
})
export class AcademicComponent implements OnInit {
  records: any[] = [];
  attendanceRecords: any[] = [];
  studentAssignments: any[] = [];

  form: any = {
    rollno: '',
    semester: '',
    subjects: [{ subjectName: '', grade: '', internalMarks: null }],
    GPA: null
  };

  editMode = false;
  editId: string | null = null;

  userRole: string = '';
  userEmail: string = '';

  private API_URL = 'http://localhost:3200';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';

    this.loadRecords();

    if (this.userRole === 'student') {
      this.loadStudentAttendance();
      this.loadStudentAssignments();
    }
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('userToken') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // === Academic ===
  getAcademicRecords(): Observable<any> {
    return this.http.get(`${this.API_URL}/getAcademic`, this.getAuthHeaders());
  }

  createAcademicRecord(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/createAcademic`, data, this.getAuthHeaders());
  }

  updateAcademicRecord(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/updateAcademic/${id}`, data, this.getAuthHeaders());
  }

  deleteAcademicRecord(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/deleteAcademic/${id}`, this.getAuthHeaders());
  }

  loadRecords(): void {
    this.getAcademicRecords().subscribe({
      next: (res) => (this.records = res),
      error: (err) => {
        console.error('Failed to load records', err);
        alertify.error('Failed to load academic records');
      }
    });
  }

  loadStudentAttendance(): void {
  this.http.get(`${this.API_URL}/getattendancebyemail`, this.getAuthHeaders()).subscribe({
    next: (res: any) => {
      console.log('Attendance data:', res);
      // Extract the attendance array inside 'attendance' property
      this.attendanceRecords = Array.isArray(res.attendance) ? res.attendance : [];
    },
    error: (err) => {
      console.error('Attendance load error', err);
      alertify.error('Failed to load attendance');
    }
  });
}

loadStudentAssignments(): void {
  this.http.get(`${this.API_URL}/getassignmentsbyemail`, this.getAuthHeaders()).subscribe({
    next: (res: any) => {
      console.log('Assignment data:', res);
      // Extract the assignments array inside 'Assignment' property
      this.studentAssignments = Array.isArray(res.Assignment) ? res.Assignment : [];
    },
    error: (err) => {
      console.error('Assignments load error', err);
      alertify.error('Failed to load assignments');
    }
  });
}


  // === Subjects form ===
  addSubject(): void {
    this.form.subjects.push({ subjectName: '', grade: '', internalMarks: null });
  }

  removeSubject(index: number): void {
    if (this.form.subjects.length > 1) {
      this.form.subjects.splice(index, 1);
    }
  }

  submit(): void {
    const apiCall = this.editMode
      ? this.updateAcademicRecord(this.editId!, this.form)
      : this.createAcademicRecord(this.form);

    apiCall.subscribe({
      next: () => {
        this.resetForm();
        this.loadRecords();
        alertify.success(this.editMode ? 'Record updated' : 'Record created');
      },
      error: (err) => {
        console.error('Submit error', err);
        alertify.error(this.editMode ? 'Update failed' : 'Creation failed');
      }
    });
  }

  editRecord(record: any): void {
    this.editMode = true;
    this.editId = record._id;
    this.form = {
      rollno: record.rollno,
      semester: record.semester,
      subjects: record.subjects.map((s: any) => ({
        subjectName: s.subjectName,
        grade: s.grade,
        internalMarks: s.internalMarks
      })),
      GPA: record.GPA
    };
  }

  deleteRecord(id: string): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.deleteAcademicRecord(id).subscribe({
        next: () => {
          this.loadRecords();
          alertify.success('Record deleted');
        },
        error: (err) => {
          console.error('Delete error', err);
          alertify.error('Delete failed');
        }
      });
    }
  }

  resetForm(): void {
    this.editMode = false;
    this.editId = null;
    this.form = {
      rollno: '',
      semester: '',
      subjects: [{ subjectName: '', grade: '', internalMarks: null }],
      GPA: null
    };
  }
}
