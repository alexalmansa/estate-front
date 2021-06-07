import { NgModule } from '@angular/core';
import {NavigationEnd, Router, RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import {LoginComponent} from "./screens/login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {ProfileComponent} from "./screens/profile/profile.component";
import {BuildingsComponent} from "./screens/buildings/buildings.component";
import {FlatsComponent} from "./screens/flats/flats.component";
import { Location } from '@angular/common';
import {LeasesComponent} from "./screens/leases/leases.component";
import {AlterationsComponent} from "./screens/alterations/alterations.component";

const routes: Routes = [{ path:'', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path:'buildings', component: BuildingsComponent, canActivate: [AuthGuard]},
  { path:'flats', component: FlatsComponent, canActivate: [AuthGuard]},
  { path:'leases', component: LeasesComponent, canActivate: [AuthGuard]},
  { path:'alterations', component: AlterationsComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public history: string[] = []

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
  }
  back(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }
}
