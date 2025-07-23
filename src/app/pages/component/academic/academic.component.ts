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
  faceAttendanceRecords: any[] = [];

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
      this.loadFaceAttendanceByEmail();
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

loadFaceAttendanceByEmail(): void {
  this.http.get(`${this.API_URL}/getFaceAttendancesByEmail`, this.getAuthHeaders()).subscribe({
    next: (res: any) => {
      console.log('Face Attendance data:', res);
      this.faceAttendanceRecords = Array.isArray(res) ? res : [];
    },
    error: (err) => {
      console.error('Face Attendance load error', err);
      alertify.error('Failed to load face attendance');
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
  // === Validate required fields ===
  if (!this.form.rollno || this.form.rollno.trim() === '') {
    alertify.error('Roll number is required');
    return;
  }

  if (!this.form.semester || this.form.semester.trim() === '') {
    alertify.error('Semester is required');
    return;
  }

  if (this.form.GPA === null || this.form.GPA === undefined || this.form.GPA === '') {
    alertify.error('GPA is required');
    return;
  }

  if (this.form.GPA < 0 || this.form.GPA > 4) {
    alertify.error('GPA must be between 0 and 4');
    return;
  }

  for (const subject of this.form.subjects) {
    if (!subject.subjectName || subject.subjectName.trim() === '') {
      alertify.error('Subject name is required');
      return;
    }

    if (!subject.grade || subject.grade.trim() === '') {
      alertify.error('Grade is required');
      return;
    }

    const grade = subject.grade.toUpperCase();
    const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];

    if (!validGrades.includes(grade)) {
      alertify.error(`Invalid grade "${subject.grade}". Must be A to F`);
      return;
    }
  }

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
