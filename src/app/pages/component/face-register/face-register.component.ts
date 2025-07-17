import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-face-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './face-register.component.html',
  styleUrls: ['./face-register.component.css'],
})
export class FaceRegisterComponent implements OnInit {
  rollno: number | null = null;
  base64Image: string | null = null;
  previewImage: string | null = null;
  loading = false;
  message = '';
  success = false;
  validRollnos: number[] = [];
  attendanceList: any[] = [];
  selectedFileName: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadValidRollnos();
  }

  loadValidRollnos(): void {
    this.http.get<number[]>('http://localhost:3200/valid-rollnos').subscribe({
      next: (res) => {
        this.validRollnos = res;
      },
      error: () => {
        alert('❌ Failed to load valid roll numbers.');
      },
    });
  }

  isRollnoValid(): boolean {
    return this.rollno !== null && this.validRollnos.includes(this.rollno);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.base64Image = reader.result as string;
      this.previewImage = this.base64Image;
    };
    reader.readAsDataURL(file);
  }

  registerFace(event: Event): void {
    event.preventDefault();

    if (!this.rollno || !this.base64Image || !this.isRollnoValid()) {
      this.message = '❌ Please provide valid roll number and photo.';
      this.success = false;
      return;
    }

    this.loading = true;
    this.message = '';

    this.http
      .post('http://localhost:5000/register-face', {
        rollno: this.rollno,
        image: this.base64Image,
      })
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.message = `✅ Face registered for roll no: ${this.rollno}`;
            this.success = true;
            this.rollno = null;
            this.base64Image = null;
            this.previewImage = null;
          } else {
            this.message = '❌ Face registration failed: ' + (res.message || 'Unknown error');
            this.success = false;
          }
          this.loading = false;
        },
        error: (err) => {
          this.message = '❌ Error: ' + (err.error?.message || err.message || 'Unknown error');
          this.success = false;
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
        alert('❌ Failed to load attendance list');
        this.loading = false;
      },
    });
  }
}
