import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/screens/home/home.component';
import {LoginComponent} from "./components/screens/login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {ProfileComponent} from "./components/screens/profile/profile.component";

const routes: Routes = [{ path:'', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
