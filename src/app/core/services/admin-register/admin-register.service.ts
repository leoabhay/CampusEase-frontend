import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.api_url + 'signupAdmin';

  constructor(private http: HttpClient) {}

  signupAdmin(adminData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, adminData, { headers });
  }
}
