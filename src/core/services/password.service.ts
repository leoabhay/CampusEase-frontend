import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private baseUrl = 'http://localhost:3200';

  constructor(private http: HttpClient) {}
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/request-reset-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password?token=${token}`, { newPassword });
  }
}