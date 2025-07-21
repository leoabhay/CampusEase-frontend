import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  constructor(private http:HttpClient) { }


  postAnswerAssignment(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'postAnswerAssignment',obj)
  }
  getAnswerAssignment():Observable<any>{
    return this.http.get<any>(environment.api_url+'getassignments')
  }
  postGiveAssignment(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'postGiveAssignments',obj)
  }
  getGiveAssignment():Observable<any>{
    return this.http.get<any>(environment.api_url+'getGiveAssignments')
  }
  getAssignmentsByEnrolledSubjects():Observable<any>{
    return this.http.get<any>(environment.api_url+'getAssignmentsByEnrolledSubject')
  }
  getassignmentsbyemailStudent():Observable<any>{
    return this.http.get<any>(environment.api_url+'getassignmentsbyemail')
  }
  getAssignmentsBySubjectAPI():Observable<any>{
    return this.http.get<any>(environment.api_url+'getassignmentsbysubject')
  }
  getStudentData(studentId:string):Observable<any>{
    return this.http.get<any>(environment.api_url+(`students/${studentId}`))
  }
  updateAssignment(id:string,obj:any):Observable<any>{
    return this.http.put<any>(environment.api_url+(`putGiveAssignments/${id}`),obj)
  }
  deleteAssignment(id:string):Observable<any>{
    return this.http.delete<any>(environment.api_url+(`giveAssignments/${id}`))
  }
  updateAnswerAssignment(id: string, data: FormData): Observable<any> {
  return this.http.put(`${environment.api_url}editassignments/${id}`, data);
}

deleteAnswerAssignment(id: string): Observable<any> {
  return this.http.delete(`${environment.api_url}delassignments/${id}`);
}

}
