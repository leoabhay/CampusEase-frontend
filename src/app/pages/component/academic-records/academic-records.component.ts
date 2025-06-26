import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-academic-records',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academic-records.component.html',
  styleUrls: ['./academic-records.component.css']
})
export class AcademicRecordsComponent implements OnInit {
  uploadForm!: FormGroup;
  selectedFile: File | null = null;

  userRole: string | null = null;
  showUserProfileData: any = null;

  // Sample data (replace with real backend data later)
  items = [
    { clubName: 'Math', position: 'A+', joinedDate: 3 },
    { clubName: 'Physics', position: 'A', joinedDate: 4 },
    { clubName: 'Chemistry', position: 'B+', joinedDate: 3 },
    { clubName: 'Biology', position: 'A-', joinedDate: 4 },
    { clubName: 'Computer', position: 'A+', joinedDate: 3 }
  ];
  paginatedItems: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages: number[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.showUserProfileData = {
      name: localStorage.getItem('userName') || 'Student',
      role: this.userRole
    };

    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      type: ['', Validators.required]
    });

    this.totalPages = Array(Math.ceil(this.items.length / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
    this.setPage(1);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
    }
  }

  uploadFile(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('type', this.uploadForm.get('type')!.value);

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.post('http://localhost:3200/upload', formData, { headers })
        .subscribe(
          res => {
            alert('File uploaded and emailed to all students.');
            this.uploadForm.reset();
            this.selectedFile = null;
            // Optionally, refresh the page or update the UI to reflect the new data
            window.location.reload();
          },
          err => {
            console.error(err);
            alert('Upload failed. Check console for error.');
          }
        );
    }
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages.length) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.items.slice(startIndex, endIndex);
  }
}
