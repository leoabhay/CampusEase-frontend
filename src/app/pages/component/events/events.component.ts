import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event-service/event.service';
import { PopUpService } from '../../../core/popup/pop-up.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgxPaginationModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{

  eventForm!:FormGroup;
  eventList:any[]=[];
  eventEmailList:any[]=[];
  minDate: string | undefined;
  isEditMode:boolean= false;
  updateEvenID:string | null = null;
  userRole: string | null | undefined;
  currentPage = 1;




  constructor(private formBuilder:FormBuilder,private eventService:EventService,
    private confirmationService:PopUpService){
    this.formvalue();

  }
ngOnInit(): void {
  this.userRole = localStorage.getItem('userRole')
  this.getEventList();
  this.getEventListByEmailFunction();
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
  this.minDate =this.formatDate(minDate)
}

  formvalue(){
 // Today + 2 days

    this.eventForm=this.formBuilder.group({
      eventName:['',Validators.required],
      eventDate: ['', [Validators.required, this.dateValidator()]], // Custom date validator
      location:['',Validators.required],
      description:['',Validators.required],
      createdDate:['']
    })

  }
  dateValidator() {
    return (control: { value: any; }) => {
      const inputDate = control.value;
      const today = new Date();
      today.setDate(today.getDate() + 2); // Today + 2 days
      const minDate = this.formatDate(today);

      if (inputDate < minDate) {
        return { invalidDate: true };
      }
      return null;
    };
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onSubmit(){
    if(this.eventForm.valid){

      if (this.isEditMode && this.updateEvenID) {
        this.eventService.updateEventList(this.updateEvenID, this.eventForm.value).subscribe(res => {
          this.confirmationService.showSuccessMessage('Edited Sucessfully')
          this.getEventList();
          this.eventForm.reset();
          this.getEventListByEmailFunction()
          this.isEditMode=false;

        }, error => {
          this.confirmationService.showErrorMessage('Error updating discussion')
          this.eventForm.reset();
          this.isEditMode=false;

        });
      }
      else{
        console.log(this.eventForm.value);
      this.eventService.postaddEventList(this.eventForm.value).subscribe((res)=>{
        console.log(res);
        this.getEventList();
      this.eventForm.reset();
      this.getEventListByEmailFunction()
      })
    }
  }
  }
  getEventList(){
    this.eventService.getEventListList().subscribe((res)=>{
      console.log(res);
      this.eventList=res;
    })
  }
  getEventListByEmailFunction(){
    this.eventService.getEventByEmailAPI().subscribe((res)=>{
      console.log(res);
      this.eventEmailList=res.Events;
    })
  }
  editEvent(eventId:string){
    this.eventService.getEventId(eventId).subscribe((res)=>{
      if(!res){
        this.confirmationService.showErrorMessage('Event is not found')
      }
      this.isEditMode=true;
      this.updateEvenID=eventId;
      this.eventForm.patchValue({
        eventName:res.event.eventName,
        eventDate: res.event.eventDate,
        location:res.event.location,
        description:res.event.description,
        createdDate:res.event.createdDate
      })
      debugger
      console.log('Form value Patched',this.eventForm.value);
    })

  }
  async deleteEvent(eventId:string){
    const confirm = await this.confirmationService.showConfirmationPopup()
    if(confirm){
    this.eventService.delEventList(eventId).subscribe((res)=>{
      this.getEventListByEmailFunction()
      this.getEventList()
      this.confirmationService.showSuccessMessage('Delete SucessFully')
    })
  }
  else{
    this.confirmationService.showErrorMessage('Sorry Cannot be Deleted')
  }

  }
}
