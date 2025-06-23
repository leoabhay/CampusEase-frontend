import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-class-schedule',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './class-schedule.component.html',
  styleUrl: './class-schedule.component.css'
})
export class ClassScheduleComponent implements OnInit{
  classSchedule = [
    { name: 'Mathematics', time: '9:00 AM - 10:30 AM', location: 'Room 101', instructor: 'Dr. Smith' },
    { name: 'Physics', time: '11:00 AM - 12:30 PM', location: 'Room 102', instructor: 'Prof. Johnson' },
    { name: 'Chemistry', time: '1:00 PM - 2:30 PM', location: 'Room 103', instructor: 'Dr. Williams' },
    { name: 'Biology', time: '3:00 PM - 4:30 PM', location: 'Room 104', instructor: 'Dr. Brown' },
    { name: 'English Literature', time: '5:00 PM - 6:30 PM', location: 'Room 105', instructor: 'Prof. Davis' }
  ];

  classScheduleForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.classScheduleForm = this.formBuilder.group({
      className: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      instructor: ['']
    });
  }

  submitClassSchedule() {
    if (this.classScheduleForm.valid) {
      console.log(this.classScheduleForm.value);

    } else {
      this.classScheduleForm.markAllAsTouched();
    }
  }
}