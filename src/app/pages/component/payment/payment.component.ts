import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  idCardData: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchIdCardData();
  }

  fetchIdCardData(): void {
    this.http.get('http://localhost:3200/getIdCard').subscribe(response => {
      this.idCardData = response;
    });
  }
}