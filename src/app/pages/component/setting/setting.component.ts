import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../core/services/user_auth/user-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {
  showUserProfileData: any= null
  userData:any =null
  constructor(private userService:UserAuthService ){
  }
  ngOnInit(): void {
    this.userService.getuserDataLogin().subscribe((res)=>{
      console.log(res);
      this.showUserProfileData=res.data;
      console.log(this.showUserProfileData);
    })
    this.userService.getProfile().subscribe((res)=>{
      console.log(res);
      this.userData=res
    debugger
    })
  }
 
  
  
}
