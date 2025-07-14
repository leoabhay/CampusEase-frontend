import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Import alertifyjs (make sure alertifyjs is installed and styles included in your project)
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-schedule.component.html',
  styleUrls: ['./admin-schedule.component.css'],
})
export class AdminScheduleComponent implements OnInit {
  scheduleForm!: FormGroup;
  schedules: any[] = [];
  faculties: any[] = [];
  departments: any[] = [];
  isEditMode = false;
  selectedScheduleId: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      subject: ['', Validators.required],
      faculty: ['', Validators.required],
      department: ['', Validators.required],
      day: ['', Validators.required],
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      block: ['', Validators.required],
      roomNo: [''],
      semester: [''],
      date: ['', Validators.required],  // <-- added date input here
    });

    this.loadFaculties();
    this.loadDepartments();
    this.getSchedules();
  }

  loadFaculties() {
    this.http.get<any>('http://localhost:3200/user/faculty').subscribe({
      next: (res) => {
        this.faculties = res.faculty || [];
        console.log('Loaded faculties:', this.faculties);
      },
      error: (err) => {
        console.error('Error loading faculties:', err);
        alertify.error('Failed to load faculties');
      },
    });
  }

  loadDepartments() {
    this.http.get<any[]>('http://localhost:3200/getDepartments').subscribe({
      next: (res) => {
        this.departments = res || [];
        console.log('Departments loaded:', this.departments);
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        alertify.error('Failed to load departments');
      },
    });
  }

  getSchedules() {
    this.http.get<any>('http://localhost:3200/getSchedules').subscribe({
      next: (res) => {
        this.schedules = res.schedules || [];
        console.log('Schedules:', this.schedules);
      },
      error: (err) => {
        console.error('Error loading schedules:', err);
        alertify.error('Failed to load schedules');
      },
    });
  }

  onSubmit() {
    if (this.scheduleForm.invalid) {
      alertify.error('Please fill all required fields correctly.');
      return;
    }

    const data = this.scheduleForm.value;
    if (this.isEditMode && this.selectedScheduleId) {
      this.http
        .put(`http://localhost:3200/updateSchedule/${this.selectedScheduleId}`, data)
        .subscribe({
          next: () => {
            alertify.success('Schedule updated successfully.');
            this.resetForm();
            this.getSchedules();
          },
          error: (error) => {
            console.error('Error updating schedule:', error);
            alertify.error('Failed to update schedule.');
          },
        });
    } else {
      this.http.post('http://localhost:3200/addSchedule', data).subscribe({
        next: () => {
          alertify.success('Schedule created successfully.');
          this.resetForm();
          this.getSchedules();
        },
        error: (error) => {
          console.error('Error creating schedule:', error);
          alertify.error('Failed to create schedule.');
        },
      });
    }
  }

  onEdit(schedule: any) {
    this.isEditMode = true;
    this.selectedScheduleId = schedule._id;
    this.scheduleForm.patchValue({
      subject: schedule.subject,
      faculty: schedule.faculty?._id || schedule.faculty,
      department: schedule.department?._id || schedule.department,
      day: schedule.day,
      timeFrom: schedule.timeFrom,
      timeTo: schedule.timeTo,
      block: schedule.block,
      roomNo: schedule.roomNo,
      semester: schedule.semester,
      date: schedule.date ? schedule.date.substring(0, 10) : '', // format for input[type=date]
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.http.delete(`http://localhost:3200/deleteSchedule/${id}`).subscribe({
        next: () => {
          alertify.success('Schedule deleted successfully.');
          this.getSchedules();
        },
        error: (error) => {
          console.error('Error deleting schedule:', error);
          alertify.error('Failed to delete schedule.');
        },
      });
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedScheduleId = null;
    this.scheduleForm.reset();
  }
}
