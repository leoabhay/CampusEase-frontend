import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpService } from '../../../core/services/otp-service/otp.service';
import { EnrollmentService } from '../../../core/services/enrollment_service/enrollment.service';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';

@Component({
  selector: 'app-attendance-record',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './attendance-record.component.html',
  styleUrl: './attendance-record.component.css'
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
  enrollmentDatabyEnrolledsubject: any[] = [] 
  studentAttendance: any[] = [] 
  email!: string;
  otp!: string;
  name!: string;
  enteredDateOtp!: string;

  location: string | undefined;





  constructor(private formBuilder: FormBuilder, private otpService: OtpService,
    private enrollmentservice: EnrollmentService,private userService:UserAuthService
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    this.enrollmentservice.getenrollmentDatabyEnrolledsubject().subscribe((res) => {
      console.log(res);
      this.enrollmentDatabyEnrolledsubject = res.users
      debugger
    })
    this.userService.getuserDataLogin().subscribe((res)=>{
      console.log(res);
      res.data
      // this.studentId =  res.data._id;
        this.name =  res.data.name;
        this.email =  res.data.email;
        // this.rollno =  res.data.rollno;
        // this.subject =  res.data.subject;
        // this.remarks =  res.data.remarks;
    })
    this.otpService.getAttendanceEmail().subscribe((student) => {
      this.studentAttendance = student.attendance;
      debugger

    })
    // this.otpService.getAttendanceTeacher().subscribe((resp) => {
    //   console.log(resp);
    //   debugger

    // })
    this.getUserLocation();
  }
  
 
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        },
        (error) => {
          console.error('Error getting location', error);
          this.location = 'Unable to retrieve location';
        }
      );
    } else {
      this.location = 'Geolocation is not supported by this browser.';
    }
  }

  submitAttendance() {

  }
 

  sendOtp(item: any): void {
    const obj = {
      studentId: item.rollno,
      email: item.email,
      location: this.location 
    };
    this.otpService.sendOtp(obj).subscribe(
      response => {
        console.log('OTP sent successfully', response);
      },
      error => {
        console.error('Error sending OTP', error);
      }
    );
  }

  sendAllOtps(): void {
    this.enrollmentDatabyEnrolledsubject.forEach(item => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            const obj = {
              studentId: item.rollno,
              email: item.email,
              location
            };
            this.otpService.sendOtp(obj).subscribe(
              response => {
                console.log(`OTP sent successfully to ${item.email}`, response);
              },
              error => {
                console.error(`Error sending OTP to ${item.email}`, error);
              }
            );
          },
          (error) => {
            console.error('Error getting location', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    });
  }
  
  verifyOTP() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.otpService.verifyOtp(this.email, this.otp, location)
            .subscribe(
              response => {
                if (response.success) {
                  this.verified = true;
                  this.invalidOtp = false;
                  this.error = '';
                } else {
                  this.verified = false;
                  this.invalidOtp = true;
                  this.error = response.error;
                }
                console.log('Attendance marked successfully');
              },
              error => {
                this.error = 'Error verifying OTP: ' + error.message;
                console.error('Error marking attendance:', error);
              }
            );
        },
        (error) => {
          this.error = 'Error getting location: ' + error.message;
          console.error('Error getting location', error);
        }
      );
    } else {
      this.error = 'Geolocation is not supported by this browser.';
    }
  }
  

}