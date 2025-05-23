import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth/auth-guard';
import { AdminGuard } from './auth/admin-guard';
import { CoordinatorGuard } from './auth/coordinator-guard';
import { UserComponent } from './components/user-components/user/user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserCreateComponent } from './components/user-components/user-create/user-create.component';
import { UserListComponent } from './components/user-components/user-list/user-list.component';
import { StudentCreateComponent } from './components/student-components/student-create/student-create.component';
import { StudentListComponent } from './components/student-components/student-list/student-list.component';
import { StudentComponent } from './components/student-components/student/student.component';
import { CompanyCreateComponent } from './components/comany-components/company-create/company-create.component';
import { CompanyListComponent } from './components/comany-components/company-list/company-list.component';
import { CompanyComponent } from './components/comany-components/company/company.component';
import { InternshipCreateComponent } from './components/internship-components/internship-create/internship-create.component';
import { InternshipComponent } from './components/internship-components/internship/internship.component';
import { InternshipSelectComponent } from './components/internship-components/internship-select/internship-select.component';
import { InternshipListComponent } from './components/internship-components/internship-list/internship-list.component';
import { StudentInternshipCreateComponent } from './components/internship-components/student-internship-create/student-internship-create.component';
import { StudentInternshipDetailsComponent } from './components/internship-components/student-internship-details/student-internship-details.component';
import { StudentGuard } from './auth/student-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'users/create', component: UserCreateComponent, canActivate: [AdminGuard] },
  { path: 'users/list', component: UserListComponent, canActivate: [AdminGuard] },
  { path: 'users/details/:username', component: UserComponent, canActivate: [AdminGuard] },

  { path: 'students/create', component: StudentCreateComponent, canActivate: [CoordinatorGuard] },
  { path: 'students/list', component: StudentListComponent, canActivate: [CoordinatorGuard] },
  { path: 'students/details/:neptuncode', component: StudentComponent, canActivate: [CoordinatorGuard] },

  {path: 'companies/create', component: CompanyCreateComponent, canActivate: [CoordinatorGuard] },
  {path: 'companies/list', component: CompanyListComponent, canActivate: [CoordinatorGuard] },
  {path: 'companies/details/:id', component: CompanyComponent, canActivate: [CoordinatorGuard] },

  {path: 'internships/create', component: InternshipCreateComponent, canActivate: [CoordinatorGuard] },
  {path: 'internships/details/:id', component: InternshipComponent, canActivate: [CoordinatorGuard] },
  {path: 'internships/selection', component: InternshipSelectComponent, canActivate: [CoordinatorGuard] },
  {path: 'internships/list/:year/:completed', component: InternshipListComponent, canActivate: [CoordinatorGuard] },

  {path: 'my-internship', component: StudentInternshipDetailsComponent, canActivate: [StudentGuard] },
  {path: 'my-internship/create', component: StudentInternshipCreateComponent, canActivate: [StudentGuard] },
  { path: '**', redirectTo: '/login' }
];
