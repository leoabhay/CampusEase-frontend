import { Routes } from '@angular/router';
import { WebsiteComponent } from './website/website/website.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { DashboardComponent } from './shared/dashboard/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { StudentDetailsComponent } from './pages/component/user-details/user-details.component';
import { UserManagementComponent } from './pages/admin-component/user-management/user-management.component';
import { ProfileComponent } from './pages/component/profile/profile.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
// import { ChatComponent } from './pages/component/chat/chat.component';
import { CvSubmissionComponent } from './pages/component/cv-submission/cv-submission.component';
import { AdminCvListComponent } from './pages/admin-component/admin-cv-list/admin-cv-list.component';

export const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent,
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
     {
         path:'registration-page',
         component:RegisterPageComponent
     },
     {
        path: 'reset-password',
        component: ResetPasswordComponent
     },
    {
        path:'cv-submission',
        component:CvSubmissionComponent,
        // canActivate:[authGuard]
    },
    {
        path:'admin-cv-list',
        component:AdminCvListComponent,
        canActivate:[authGuard]
    },
    {
        path:'dashboard',
        component:DashboardComponent,
        canActivate:[authGuard]
    },
    { path: 'student/:id', component: StudentDetailsComponent,  canActivate:[authGuard] },

    {
  path: 'user-management',
  component: UserManagementComponent,
  canActivate: [authGuard]
},
{
  path: 'profile',
  component: ProfileComponent,
  canActivate: [authGuard]
},


];
