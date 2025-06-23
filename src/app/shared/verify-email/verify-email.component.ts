import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import alertify from 'alertifyjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      this.http.get(`${environment.api_url}verify-signup?token=${token}`).subscribe(
        (res: any) => {
          if (res.message === 'Email verification successful, you can now log in') {
            alertify.success(res.message);
            this.router.navigate(['/login']);
          } else {
            alertify.error(res.message);
          }
        },
        err => {
          alertify.error('Verification failed');
        }
      );
    });
  }
}