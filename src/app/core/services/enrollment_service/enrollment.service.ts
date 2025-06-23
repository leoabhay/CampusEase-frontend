import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }
  postEnrollment(obj: any): Observable<any> {
    return this.http.post(environment.api_url + 'enrollmentCreate', obj)
  }
  getEnrollmentData(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentData')
  }
  getSubjectDataList(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentData/subjects')
  }
  getSubjectDataListAll(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'subjectsList')
  }
  getSubjectDataById(id: string): Observable<any> {
    return this.http.get<any>(environment.api_url + (`subjects/${id}`))
  }
  postEnrollmentJoin(obj: any): Observable<any> {
    return this.http.post(environment.api_url + 'postEnrollmentKeyForm', obj)
  }

  delEnrollmentList(id: string): Observable<any> {
    return this.http.delete<any>(environment.api_url + (`enrollmentDelete/${id}`))
  }
  deleteSubjectFromEnrollment(enrollmentId: string, subjectCode: string): Observable<any> {
    return this.http.delete<any>(environment.api_url + `deleteSubject/${enrollmentId}/${subjectCode}`);
  }
  getEnrollmentDataByEmail(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentDatabyEmail')
  }
  deleteEnrollmentData(): Observable<any> {
    return this.http.delete<any>(environment.api_url + 'enrollmentDatabyEmail')
  }
  getenrollmentDatabyEnrolledsubject(): Observable<any> {
    return this.http.get<any>(environment.api_url + 'enrollmentDatabyEnrolledsubject')
  }
}
