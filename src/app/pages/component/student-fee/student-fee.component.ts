import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import KhaltiCheckout from "khalti-checkout-web";
import QRCode from 'qrcode';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-student-fee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-fee.component.html',
  styleUrls: ['./student-fee.component.css']
})
export class StudentFeeComponent {
  feeForm!: FormGroup;
  studentId: string = '';
  qrCodeDataUrl: string = '';
  showQRCode = false;
  qrScanned = false; // Track if user confirmed scanning QR code

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.feeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      method: ['Khalti', Validators.required]
    });

    const tokenData = this.parseJwt(localStorage.getItem('userToken') || '');
    this.studentId = tokenData.userId || '';
  }

  parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  }

  payWithKhalti(): void {
    const config = {
      publicKey: "test_public_key_0275cc5e2bae42fb890536aae01e9e73",
      productIdentity: this.studentId,
      productName: "College Fee Payment",
      productUrl: "http://yourcollege.com/student/fees",
      eventHandler: {
        onSuccess: (payload: any) => {
          alertify.success("Payment successful!");
          this.submitFee('Online');
        },
        onError: (error: any) => {
          console.error(error);
          alertify.error("Payment failed!");
        },
        onClose: () => {
          console.log("Khalti widget closed");
        }
      },
      paymentPreference: [
        "KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"
      ],
    };

    const checkout = new KhaltiCheckout(config);
    const amount = Number(this.feeForm.value.amount) * 100;
    checkout.show({ amount });
  }

  generateQRCode(): void {
    const amount = this.feeForm.value.amount;
    const qrText = `StudentID:${this.studentId}, Amount:Rs${amount}, Purpose:College Fee`;

    QRCode.toDataURL(qrText)
      .then(url => {
        this.qrCodeDataUrl = url;
        this.showQRCode = true;
        this.qrScanned = false; // reset on new QR code generation
      })
      .catch(err => {
        console.error(err);
        alertify.error('Failed to generate QR');
      });
  }

  onSubmit(): void {
    if (this.feeForm.invalid) {
      alertify.error('Form is invalid!');
      return;
    }

    const method = this.feeForm.value.method;
    this.showQRCode = false;
    this.qrScanned = false;

    if (method === 'Cash') {
      this.submitFee('Cash');
    } else if (method === 'QR') {
      this.generateQRCode();
    } else {
      this.payWithKhalti();
    }
  }

  onQRCodeScanned(): void {
    this.qrScanned = true;
  }

  proceedWithQRPayment(): void {
    this.submitFee('QR');
  }

  submitFee(method: string): void {
    const token = localStorage.getItem('userToken') || '';
    const headers = { Authorization: `Bearer ${token}` };
    const payload = {
      studentId: this.studentId,
      amount: Number(this.feeForm.value.amount),
      method: method
    };

    this.http.post(`${environment.api_url}payFee`, payload, { headers }).subscribe(
      (res: any) => {
        alertify.success(res.message || 'Fee paid successfully!');
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        alertify.error(err.error?.message || 'Failed to process fee payment');
      }
    );
  }
}
