import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-admin-fee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-fee.component.html',
  styleUrls: ['./admin-fee.component.css']
})
export class AdminFeeComponent implements OnInit {
  fees: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFees();
  }

  fetchFees() {
    this.loading = true;
    const token = localStorage.getItem('userToken') || '';
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${environment.api_url}getAllFees`, { headers }).subscribe(
      (data) => {
        this.fees = data;
        this.loading = false;
      },
      (err) => {
        alertify.error('Failed to fetch fees');
        this.loading = false;
      }
    );
  }

  approveFee(feeId: string) {
    const token = localStorage.getItem('userToken') || '';
    const headers = { Authorization: `Bearer ${token}` };

    // Optionally: confirm before approving
    // if (!confirm('Are you sure you want to approve this payment?')) return;

    this.http.patch(`${environment.api_url}approveFee/${feeId}`, {}, { headers }).subscribe(
      (res: any) => {
        alertify.success(res.message || 'Payment approved');
        this.fetchFees();
      },
      (err) => {
        alertify.error(err.error?.message || 'Approval failed');
      }
    );
  }

  rejectFee(feeId: string) {
    const token = localStorage.getItem('userToken') || '';
    const headers = { Authorization: `Bearer ${token}` };

    // Optionally: confirm before rejecting
    // if (!confirm('Are you sure you want to reject this payment?')) return;

    this.http.patch(`${environment.api_url}rejectFee/${feeId}`, {}, { headers }).subscribe(
      (res: any) => {
        alertify.success(res.message || 'Payment rejected');
        this.fetchFees();
      },
      (err) => {
        alertify.error(err.error?.message || 'Rejection failed');
      }
    );
  }

  deleteFee(feeId: string) {
    if (!confirm('Are you sure you want to delete this fee record?')) return;

    const token = localStorage.getItem('userToken') || '';
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete(`${environment.api_url}deleteFee/${feeId}`, { headers }).subscribe(
      (res: any) => {
        alertify.success(res.message || 'Deleted successfully');
        this.fetchFees();
      },
      (err) => {
        alertify.error(err.error?.message || 'Delete failed');
      }
    );
  }
}
