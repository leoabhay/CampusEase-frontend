import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) {}

  // Create a new enrollment
  postEnrollment(obj: any): Observable<any> {
    return this.http.post(environment.api_url + 'enrollmentCreate', obj);
  }

  // Get all enrollment data
  getEnrollmentData(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentData');
  }

  // Get subject data linked with enrollment
  getSubjectDataList(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentData/subjects');
  }

  // Get all subject data
  getSubjectDataListAll(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'subjectsList');
  }

  // Get specific subject by ID
  getSubjectDataById(id: string): Observable<any> {
    return this.http.get<any>(environment.api_url + `subjects/${id}`);
  }

  // Join enrollment via shared key/form
  postEnrollmentJoin(obj: any): Observable<any> {
    return this.http.post(environment.api_url + 'postEnrollmentKeyForm', obj);
  }

  // Delete enrollment by ID
  delEnrollmentList(id: string): Observable<any> {
    return this.http.delete<any>(environment.api_url + `enrollmentDelete/${id}`);
  }

  // Delete a subject from an enrollment
  deleteSubjectFromEnrollment(enrollmentId: string, subjectCode: string): Observable<any> {
    return this.http.delete<any>(environment.api_url + `deleteSubject/${enrollmentId}/${subjectCode}`);
  }

  // Get enrollments by logged-in user's email
  getEnrollmentDataByEmail(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentDatabyEmail');
  }

  // Delete enrollments by logged-in user's email
  deleteEnrollmentData(): Observable<any> {
    return this.http.delete<any>(environment.api_url + 'enrollmentDatabyEmail');
  }

  // Get enrollment data filtered by enrolled subjects
  getenrollmentDatabyEnrolledsubject(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentDatabyEnrolledsubject');
  }

  // Update enrollment by ID
  UpdateEnrollmentData(enrollmentId: string, obj: any): Observable<any> {
    return this.http.put<any>(environment.api_url + `enrollmentUpdate/${enrollmentId}`, obj);
  }
}
