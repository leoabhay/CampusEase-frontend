import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Required for [(ngModel)]

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  idCardData: any[] = [];
  editMode: boolean = false;
  editCardData: any = {}; // used to bind data in the form

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchIdCardData();
  }

  fetchIdCardData(): void {
  const token = localStorage.getItem('userToken') || '';
  this.http.get<any>('http://localhost:3200/getIdCard', {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe(response => {
    this.idCardData = response.idcard;
  });
}


  approvePayment(id: string): void {
    this.http.post(`http://localhost:3200/approvePayment/${id}`, {}).subscribe(() => {
      this.fetchIdCardData(); // refresh list after update
    });
  }

  declinePayment(id: string): void {
    if (confirm('Are you sure you want to delete this ID card request?')) {
      this.http.delete(`http://localhost:3200/deleteIdCard/${id}`).subscribe(() => {
        this.fetchIdCardData(); // refresh list after delete
      });
    }
  }

  editCard(card: any): void {
    this.editMode = true;
    this.editCardData = { ...card }; // clone card data to edit
  }

  updateCard(): void {
    const id = this.editCardData._id;
    this.http.put(`http://localhost:3200/IDCardUpdate/${id}`, this.editCardData).subscribe(() => {
  this.editMode = false;
  this.fetchIdCardData();
});
  }
  cancelEdit(): void {
    this.editMode = false;
    this.editCardData = {}; // reset edit data
  }
}
