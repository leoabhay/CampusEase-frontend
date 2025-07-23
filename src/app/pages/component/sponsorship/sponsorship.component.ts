import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department-service/department.service';
import { SponsoeshipService } from '../../../core/services/sponsorship-service/sponsorship.service';
import * as alertify from 'alertifyjs';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-sponsorship',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './sponsorship.component.html',
  styleUrls: ['./sponsorship.component.css']
})
export class SponsorshipComponent implements OnInit {

  departments: any[] = [];
  form!: FormGroup;
  sponsorshipByEmailList: any[] = [];
  sponsorshipByAdminList: any[] = [];
  userRole: string | null | undefined;

  currentPage = 1;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private departmentService: DepartmentService,
    private sponsorshipService: SponsoeshipService,
    private confirmationService: PopUpService
  ) {
    this.form = this.fb.group({
      name: [''],
      faculty: ['', Validators.required],
      semester: ['', Validators.required],
      topic: ['', Validators.required],
      money: ['', [Validators.required, Validators.min(0)]],
      reason: ['', Validators.required],
      decision: ['Pending'],
      sponsor: ['admin@gmail.com'] // fixed email typo
    });

    this.getDepartmentList();
    this.getSponsorshipByEmailList();
    this.getSponsorshipByAdminList();
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.getSponsorshipByAdminList()
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Value:', this.form.value);
      this.sponsorshipService.postSponsorshipRequest(this.form.value).subscribe({
        next: (res) => {
          console.log(res);
          alertify.success('Sponsorship Requested');
          this.form.reset();
          this.form.patchValue({
            decision: 'Pending',
            sponsor: 'admin@gmail.com'
          });
          this.getSponsorshipByEmailList();
        },
        error: (err) => {
          console.error('Error submitting sponsorship:', err);
          alertify.error('Failed to request sponsorship');
        }
      });
    }
  }

  getSponsorshipByEmailList() {
    this.sponsorshipService.getSponsorshipByEmail().subscribe({
      next: (res) => {
        console.log(res);
        this.sponsorshipByEmailList = res.Sponsorship || res.sponsorship || [];
      },
      error: (err) => {
        console.error('Error fetching sponsorships by email:', err);
        this.sponsorshipByEmailList = [];
      }
    });
  }

  // getSponsorshipByAdminList() {
  //   this.sponsorshipService.getSponsorshipByAdmin().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.sponsorshipByAdminList = res.sponsorship || res.sponsorships || [];
  //     },
  //     error: (err) => {
  //       console.error('Error fetching sponsorships by admin:', err);
  //       this.sponsorshipByAdminList = [];
  //     }
  //   });
  // }
  getSponsorshipByAdminList() {

  this.sponsorshipService.getSponsorshipRequest().subscribe({
      next: (res) => {
        console.log(res);
        // this.sponsorshipByAdminList = res.sponsorship || res.Sponsorship || [];
       this.sponsorshipByAdminList = res || []; // Adjusted to handle the response correctly
        debugger
      },
         error: (err) => {
        console.error('Error fetching sponsorships by admin:', err);
        this.sponsorshipByAdminList = [];
      }
    });

  }
  getDepartmentList() {
    this.departmentService.getDepartmentsList().subscribe({
      next: (res) => {
        console.log(res);
        this.departments = res;
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
        this.departments = [];
      }
    });
  }

  async deleteSpon(sponsorshipId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {
      this.sponsorshipService.delSponsorshipList(sponsorshipId).subscribe({
        next: (res) => {
          console.log(res);
          this.getSponsorshipByEmailList();
          this.confirmationService.showSuccessMessage('Deleted Successfully');
        },
        error: (err) => {
          console.error('Error deleting sponsorship:', err);
          alertify.error('Failed to delete sponsorship');
        }
      });
    }
  }

  updateSponsorship(id: string, decision: string) {
    this.sponsorshipService.updateSponsorship(id, decision).subscribe({
      next: (response) => {
        console.log(response);
        this.getSponsorshipByAdminList();
      },
      error: (error) => {
        console.error('Error updating sponsorship:', error);
        alertify.error('Failed to update sponsorship');
      }
    });
  }

  trackById(index: number, item: any): string {
    return item._id;
  }

}
