import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.css']
})
export class UserScheduleComponent implements OnInit {
  schedules: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules() {
    this.http.get<any>('http://localhost:3200/getSchedules').subscribe(res => {
      this.schedules = res.schedules;
    });
  }
}
