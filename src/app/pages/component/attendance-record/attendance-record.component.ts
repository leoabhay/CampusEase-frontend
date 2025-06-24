import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpService } from '../../../core/services/otp-service/otp.service';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-attendance-record',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './attendance-record.component.html',
  styleUrls: ['./attendance-record.component.css']
})
export class AttendanceRecordComponent implements OnInit {
  enteredOtp: string | undefined;
  enteredSubject: string | undefined;
  enteredDate: string | undefined;
  enteredRemarks: string | undefined;
  verified = false;
  invalidOtp = false;
  error = '';

  userRole: string | null | undefined;
  enrollmentDatabyEnrolledsubject: any[] = [];
  studentAttendance: any[] = [];
  email!: string;
  otp!: string;
  name!: string;
  enteredDateOtp!: string;

  location: { latitude: number; longitude: number } | null = null;
  locationError = '';

  constructor(
    private formBuilder: FormBuilder,
    private otpService: OtpService,
    private enrollmentservice: EnrollmentService,
    private userService: UserAuthService
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');

    this.enrollmentservice.getenrollmentDatabyEnrolledsubject().subscribe((res) => {
      this.enrollmentDatabyEnrolledsubject = res.users;
    });

    this.userService.getuserDataLogin().subscribe((res) => {
      this.name = res.data.name;
      this.email = res.data.email;
    });

    // Fetch attendance based on role: for faculty fetch all, for student fetch own
    if (this.userRole === 'faculty') {
      this.otpService.getAttendance().subscribe((attendance) => {
        this.studentAttendance = attendance.attendance;
      });
    } else {
      this.otpService.getAttendanceEmail().subscribe((student) => {
        this.studentAttendance = student.attendance;
      });
    }

    this.getUserLocation();
  }

  getUserLocation(): void {
    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by this browser.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.locationError = '';
      },
      (error) => {
        this.locationError = 'Location access denied. Please allow location access to proceed.';
        console.error('Error getting location', error);
      },
      { enableHighAccuracy: true }
    );
  }

  sendOtp(item: any): void {
  if (!this.location) {
    alert(this.locationError || 'Location is not available.');
    return;
  }

  const obj = {
    studentId: item.rollno,
    email: item.email,
    location: this.location
  };

  this.otpService.sendOtp(obj).subscribe(
    (response) => {
      console.log('OTP sent to', item.email, response);
      alert(`OTP sent successfully to ${item.email}`);
    },
    (error) => {
      console.error('Error sending OTP to', item.email, error);
      alert(`OTP sent successfully to ${item.email}`);
    }
  );
}



sendAllOtps(): void {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      const otpObservables = this.enrollmentDatabyEnrolledsubject.map((item) => {
        const obj = {
          studentId: item.rollno,
          email: item.email,
          location
        };

        return this.otpService.sendOtp(obj);
      });

      forkJoin(otpObservables).subscribe(
        (responses) => {
          console.log('All OTPs sent successfully', responses);
          alert('All OTPs sent successfully.');
        },
        (error) => {
          console.error('Error sending some OTPs', error);
          alert('All OTPs sent successfully.');
        }
      );
    },
    (error) => {
      alert('Location access denied. Please allow access to send OTPs.');
      console.error('Location error:', error);
    },
    { enableHighAccuracy: true }
  );
}


  verifyOTP(): void {
    if (!this.location) {
      this.error = this.locationError || 'Location is required to verify attendance.';
      return;
    }

    this.otpService.verifyOtp(this.email, this.otp, this.location).subscribe(
      (response) => {
        if (response.success) {
          this.verified = true;
          this.invalidOtp = false;
          this.error = '';
          alert('Attendance marked successfully.');
        } else {
          this.verified = false;
          this.invalidOtp = true;
          this.error = response.error;
          alert('Attendance not marked: ' + response.error);
        }

        // Refresh attendance after verifying OTP
        if (this.userRole === 'faculty') {
          this.otpService.getAttendance().subscribe(
            (attendance) => {
              this.studentAttendance = attendance.attendance;
            },
            (error) => {
              console.error('Error fetching updated attendance:', error);
            }
          );
        } else {
          this.otpService.getAttendanceEmail().subscribe(
            (student) => {
              this.studentAttendance = student.attendance;
            },
            (error) => {
              console.error('Error fetching updated attendance:', error);
            }
          );
        }
      },
      (error) => {
        this.error = 'Error verifying OTP: ' + error.message;
        console.error('Error verifying OTP:', error);
      }
    );
  }
}
