import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private baseUrl = environment.api_url;

  constructor(private http: HttpClient) {}
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/request-reset-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password?token=${token}`, { newPassword });
  }
}
