import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobVacancyService } from '../../../core/services/jobVacancy-service/job-vacancy.service';
import { PopUpService } from '../../../core/popup/pop-up.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-job-vacancy',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './job-vacancy.component.html',
  styleUrl: './job-vacancy.component.css'
})
export class JobVacancyComponent implements OnInit {
  vacancyForm: FormGroup;
  jobVacancyList: any[] = [];
  isEditMode: boolean = false;
  addVacancyId: string | null = null;



  constructor(private fb: FormBuilder, private http: HttpClient, private jobVacancyService: JobVacancyService,
    private confirmationService: PopUpService
  ) {
    this.vacancyForm = this.fb.group({
      vacancyPosition: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]], 
      vacancyExperience: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],
      vacancyLevel: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]], 
      vacancySubject: ['', [Validators.required,Validators.pattern(/^[a-zA-Z ]*$/)]],  
      vacancyQualification: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]], 
      time: ['', Validators.required],
      vacancySalary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    
    });
  }

  ngOnInit(): void {
    this.showJobVacancy()
  }
  onSubmit() {
    if (this.vacancyForm.valid) {
      if (this.isEditMode && this.addVacancyId) {
        this.jobVacancyService.updateVacancy(this.addVacancyId, this.vacancyForm.value).subscribe(
          (res) => {
            console.log('Vacancy updated successfully:', res);
            alertify.success('Vacancy updated successfully');
            this.vacancyForm.reset();
            this.isEditMode = false;
            this.showJobVacancy(); // Refresh vacancy list
          },
          (error) => {
            console.error('Error updating vacancy:', error);
            alertify.error('Error updating vacancy');
            this.vacancyForm.reset();
          }
        );
      } else {
        this.jobVacancyService.postAnswerAssignment(this.vacancyForm.value).subscribe(
          (res) => {
            console.log('Vacancy added successfully:', res);
            this.showJobVacancy(); // Refresh vacancy list
            this.vacancyForm.reset();
            this.confirmationService.showSuccessMessage('Vacancy Added');
          },
          (error) => {
            console.error('Error adding vacancy:', error);
            this.confirmationService.showErrorMessage('Error adding vacancy');
          }
        );
      }
    } else {
      this.confirmationService.showErrorMessage('Please enter valid vacancy details');
    }
  }

  showJobVacancy() {
    this.jobVacancyService.getAnswerAssignment().subscribe((res) => {
      this.jobVacancyList = res;
    })
  }

  editVacancy(vacancyId: string) {
    console.log('Editing vacancy:', vacancyId);

    this.jobVacancyService.getVacancyById(vacancyId).subscribe(
      (res) => {
        console.log('Response from getVacancyById:', res);

        if (!res) {
          this.confirmationService.showErrorMessage('Vacancy not found or unable to fetch details.');
          return;
        }

        this.isEditMode = true;
        this.addVacancyId = vacancyId;

        // Patch form values
        this.vacancyForm.patchValue({
          vacancyPosition: res.vacancyPosition || '',
          vacancyExperience: res.vacancyExperience || '',
          vacancyLevel: res.vacancyLevel || '',
          vacancySubject: res.vacancySubject || '',
          vacancyQualification: res.vacancyQualification || '',
          time: res.time || '',
          vacancySalary: res.vacancySalary || '',
        });

        console.log('Form values patched:', this.vacancyForm.value);
      },
      (error) => {
        console.error('Error fetching vacancy details:', error);
        this.confirmationService.showErrorMessage('Error fetching vacancy details. Please try again later.');
      }
    );
  }




  async deleteVacancy(vacancyId: string) {
    const confirmed = await this.confirmationService.showConfirmationPopup();
    if (confirmed) {
      this.jobVacancyService.delVacancyList(vacancyId).subscribe((res) => {
        console.log(res);
        this.confirmationService.showSuccessMessage('Delete Sucessfully Done');
        this.showJobVacancy()
      })
    }
    else {
      this.confirmationService.showErrorMessage('Sorry Cannot be Deleted');
    }
  }
}
