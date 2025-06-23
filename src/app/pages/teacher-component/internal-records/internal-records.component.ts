import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-internal-records',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './internal-records.component.html',
  styleUrl: './internal-records.component.css'
})
export class InternalRecordsComponent implements OnInit{
  valuationForm!: FormGroup;
  selectedFile: File | null = null;
  subjectList:any[]=[]
  constructor(private formBuilder:FormBuilder,private enrollmentservice: EnrollmentService,private http: HttpClient){}
 
  ngOnInit(): void {
    this.valuationForm = this.formBuilder.group({
      type: ['', Validators.required],
      subject: ['', Validators.required]
    });
    this.getSubjectList()
    }

    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0];
    }
  
    onUpload(): void {
      if (this.valuationForm.invalid || !this.selectedFile) {
        alert('Please fill all required fields and select a file.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('type', this.valuationForm.get('type')?.value);
      formData.append('subject', this.valuationForm.get('subject')?.value);
  
      this.http.post('http://localhost:3200/internalUpload', formData)
        .subscribe(
          response => {
            console.log('Upload successful', response);
            alert('Upload successful');
          },
          error => {
            console.error('Upload error', error);
            alert('Upload error');
          }
        );
    }
    getSubjectList(){
      this.enrollmentservice.getSubjectDataList().subscribe((res) => {
        console.log(res);
        this.subjectList = res.subjects;
      })
    }
  }