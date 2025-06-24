import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';

@Component({
  selector: 'app-academic-records',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academic-records.component.html',
  styleUrls: ['./academic-records.component.css']
})
export class AcademicRecordsComponent implements OnInit {
  itemsPerPage = 5;
  currentPage = 1;
  totalItems = 0;
  totalPages: number[] = [];
  paginatedItems: any[] = [];

  userRole: string | null = null;
  selectedFile: File | null = null;
  uploadForm!: FormGroup;

  showUserProfileData: any = null;
  userData: any = null;

  items = [
    { clubName: 'Mark', position: 'Otto', joinedDate: '2022-01-01' },
    { clubName: 'Jacob', position: 'Thornton', joinedDate: '2022-01-02' },
    { clubName: 'Larry', position: 'the Bird', joinedDate: '2022-01-03' },
    { clubName: 'John', position: 'Doe', joinedDate: '2022-01-04' },
    { clubName: 'Jane', position: 'Doe', joinedDate: '2022-01-05' },
    { clubName: 'Smith', position: 'Jones', joinedDate: '2022-01-06' },
    { clubName: 'Emily', position: 'Johnson', joinedDate: '2022-01-07' },
    { clubName: 'Michael', position: 'Brown', joinedDate: '2022-01-08' },
    { clubName: 'Sarah', position: 'Davis', joinedDate: '2022-01-09' },
    { clubName: 'David', position: 'Miller', joinedDate: '2022-01-10' }
  ];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserAuthService // ✅ Injected properly
  ) {}

  ngOnInit(): void {
    // 1. Set up pagination
    this.totalItems = this.items.length;
    this.totalPages = Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
    this.setPage(1);

    // 2. Get role and form
    this.userRole = localStorage.getItem('userRole');
    this.uploadForm = this.formBuilder.group({
      file: [null, Validators.required],
      type: ['', Validators.required],
    });

    // 3. Fetch user data
    this.userService.getuserDataLogin().subscribe((res) => {
      console.log('getuserDataLogin:', res);
      this.showUserProfileData = res.data;
    });

    this.userService.getProfile().subscribe((res) => {
      console.log('getProfile:', res);
      this.userData = res;
    });
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages.length) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.items.slice(startIndex, endIndex);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({
        file: this.selectedFile
      });
    }
  }

  uploadFile(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('type', this.uploadForm.get('type')!.value);

      this.http.post('http://localhost:3200/upload', formData).subscribe(
        response => {
          console.log('File uploaded successfully:', response);
        },
        error => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }
}
