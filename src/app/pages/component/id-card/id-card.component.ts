import { Component } from '@angular/core';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import KhaltiCheckout from "khalti-checkout-web";
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-id-card',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './id-card.component.html',
  styleUrl: './id-card.component.css'
})
export class IdCardComponent {
  showUserProfileData:any=null;
  enrollForm!: FormGroup;

  constructor(private userService:UserAuthService,private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ){
    this.showUserProfile()
  }
  ngOnInit(): void {
    this.enrollForm = this.formBuilder.group({
      email: ['', ],
      name: ['', ],
      rollno: ['', ],
      semester: ['', ],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      department: ['',],
      reason: ['', Validators.required],

    });
    this.showUserProfile()
  }
  showUserProfile() {
    this.userService.getIdCardData().subscribe((res) => {
      console.log(res);
      // this.showUserProfileData = res.data; 
      // console.log(this.showUserProfileData);
      this.showUserProfileData = res;
      debugger

    });
  }
  makePayment(): void {
    const config = {
      publicKey: "test_public_key_0275cc5e2bae42fb890536aae01e9e73",
      productIdentity: "1234567890",
      productName: "Drogon",
      productUrl: "http://gameofthrones.com/buy/Dragons",
      eventHandler: {
        onSuccess: (payload: any) => {
          alertify.success("Payment successful");
          this.submitForm(payload);
        },
        onError: (error: any) => {
          console.log(error);
          alertify.error("Payment failed");
        },
        onClose: () => {
          console.log('Widget is closing');
        }
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: 1000 });
  }

  onSubmit(): void {
    if (this.enrollForm.valid) {
      this.makePayment();
    } else {
      alert('Form is not valid. Please fill all required fields.');
    }
  }

  submitForm(paymentPayload: any): void {
    const formData = this.enrollForm.value;
    this.http.post(`${environment.api_url}postIdCard`, { ...formData, paymentPayload }).subscribe(
      (res: any) => {
        alertify.success(res.message);
        this.router.navigate(['/success']);
      },
      (err) => {
        alertify.error('Failed to submit request. Please try again.');
      }
    );
  }
}
