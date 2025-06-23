import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department-service/department.service';
import { SponsoeshipService } from '../../../core/services/sponsorship-service/sponsoeship.service';
import * as alertify from 'alertifyjs';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-sponsorship',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './sponsorship.component.html',
  styleUrl: './sponsorship.component.css'
})
export class SponsorshipComponent implements OnInit {

  departments: any[] = [];
  form!: FormGroup
  sponsorshipByEmailList: any[] = []
  sponsorshipByAdminList: any[] = []
  userRole: string | null | undefined;

  currentPage = 1;


  constructor(private fb: FormBuilder, private http: HttpClient, private departmentService: DepartmentService
    , private sponsorshipService: SponsoeshipService, private confirmationService: PopUpService
  ) {
    this.form = this.fb.group({
      name: ['',],
      faculty: ['', Validators.required],
      semester: ['', Validators.required],
      topic: ['', Validators.required],
      money: ['', Validators.required],
      reason: ['', Validators.required],
      decision: ['Pending'],
      sponsor: ['admin@gmailcom']
    });
    this.getDeaprtmentList();
    this.getSponsorshipByEmailList();
    this.getSponsorshipByAdminList();
  }
  onSubmit() {
    if (this.form.valid) {
      console.log('Form Value:', this.form.value);
      this.sponsorshipService.postSponsorshipRequest(this.form.value).subscribe((res) => {
        console.log(res);
        alertify.success('Sponsorship Requested')
        this.form.reset();
        this.getSponsorshipByEmailList();
      })
    }
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole')

  }
  getSponsorshipByEmailList() {
    this.sponsorshipService.getSponsorshipByEmail().subscribe((res) => {
      console.log(res);
      this.sponsorshipByEmailList = res.Sponsorship
    })
  }

  getSponsorshipByAdminList() {
    this.sponsorshipService.getSponsorshipByAdmin().subscribe((res) => {
      console.log(res);
      this.sponsorshipByAdminList = res.sponsorship
    })
  }

  getDeaprtmentList() {
    this.departmentService.getDepartmentsList().subscribe((res) => {
      console.log(res);
      this.departments = res;
      debugger
    })
  }
  async deleteSpon(sponsorshipId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup()
    if (confirmed) {
      this.sponsorshipService.delSponsorshipList(sponsorshipId).subscribe((res) => {
        console.log(res);
        this.getSponsorshipByEmailList();
        this.getDeaprtmentList();
        this.confirmationService.showSuccessMessage('Deleted Sucessfully')
      })
    }
  }
  updateSponsorship(id: string, decision: string) {
    this.sponsorshipService.updateSponsorship(id, decision).subscribe(
      (response) => {
        console.log(response);
        this.getSponsorshipByAdminList()
      },
      (error) => {
        console.error('Error updating sponsorship:', error);
      }
    );
  }


}