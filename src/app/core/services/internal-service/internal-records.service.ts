import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InternalRecordsService {

  constructor(private http: HttpClient) {

  }

  postStudentMarks(obj: any): Observable<any> {
  return this.http.post(environment.api_url + 'submitMarks', obj)
  }
}