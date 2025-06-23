import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../core/services/department-service/department.service';
import { ClubService } from '../../../core/services/club_service/club.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData:any[]=[];
  showUserProfileData:any=null;
  clubList:any[]=[]
  formProfile!:FormGroup;
  changePasswordForm!:FormGroup;
  userRole: string|null | undefined;
  selectedFile: File | null = null;
  profileData: any = {};


constructor(private userService:UserAuthService,private clubService:ClubService ,private formBuilder:FormBuilder ){

  this.formProfile = this.formBuilder.group({
    photo: [''], // No need for validators, file input doesn't support "required"
    address: [''],
    biography: [''],
    facebook: [''],
    instagram: [''],
    whatsapp: [''],
    website: [''],
    rollno:[0]
  });

}
// getProfile() {
//   this.userService.getProfile().subscribe(
//     data => {
//       this.profileData = data;
//       this.formProfile.patchValue({
//         address: data.address,
//         biography: data.biography,
//         facebook: data.facebook,
//         instagram: data.instagram,
//         whatsapp: data.whatsapp,
//         website: data.website
//       });
//     },
//     (error: HttpErrorResponse) => {
//       console.error('Error fetching profile:', error);
//       // alert('Error fetching profile: ' + (error.error.message || error.message));
//     }
//   );
// }
  ngOnInit(): void {
  this.userService.getuserDara().subscribe((res)=>{
    console.log("the response is "+res);
    this.userData=res.userData
    console.log('hello'+this.userData);
    console.log(this.userData);
  })
  this.changePasswordForm = this.formBuilder.group({
    oldpassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });
  this.userRole =localStorage.getItem('userRole')

  this.showUserProfile();
  this.showClub();
  // this.getProfile();
}
passwordMatchValidator(formGroup: FormGroup) {
  return formGroup.get('password')!.value === formGroup.get('confirmPassword')!.value ? null : { mismatch: true };
}

showUserProfile(){
  this.userService.getuserDataLogin().subscribe((res)=>{
    console.log(res);
    this.showUserProfileData=res.data;
    console.log(this.showUserProfileData);
  })  
}

showClub(){
  this.clubService.getClubList().subscribe((res)=>{
    console.log(res);
    this.clubList=res.clubName
  })
}
editClub(clubId:string){}
deleteClub(clubId:string){
  this.clubService.delDeleteClubList(clubId).subscribe((res)=>{
    console.log(res);
    this.showClub()
  })
}
onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}
onPasswordChange(){
  if (this.changePasswordForm.valid) {
    const formData = this.changePasswordForm.value;
    const userId = this.showUserProfileData._id;
    
    const headers = new HttpHeaders().set('Authorization', 'Bearer your-token'); // Replace with your actual token

    this.userService.changePassword(userId, formData, { headers }).subscribe(
      response => {
        alert('Password updated successfully');
        this.changePasswordForm.reset()
      },
      error => {
        alert('Something went wrong');
      }
    );
  }
}


onSubmit() {
  const formData = new FormData();
  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }
  formData.append('address', this.formProfile.get('address')?.value);
  formData.append('biography', this.formProfile.get('biography')?.value);
  formData.append('facebook', this.formProfile.get('facebook')?.value);
  formData.append('instagram', this.formProfile.get('instagram')?.value);
  formData.append('whatsapp', this.formProfile.get('whatsapp')?.value);
  formData.append('website', this.formProfile.get('website')?.value);
  // formData.append('rollno', this.formProfile.get('rollno')?.value);
  const userId = this.showUserProfileData._id; 

  this.userService.saveProfile(userId, formData).subscribe(
    response => {
      console.log(response);
      alert('Profile saved successfully!');
    },
    (error: HttpErrorResponse) => {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + (error.error.message || error.message));
    }
  );
}
}