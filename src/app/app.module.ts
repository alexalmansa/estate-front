import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './screens/home/home.component';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { LoginComponent } from './screens/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import {AuthService} from "./auth/auth.service";
import {AuthGuard} from "./auth/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

import {TokenInterceptor} from "./auth/token.interceptor";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import { IconButtonComponent } from './components/utils/icon-button/icon-button.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {BuildingTableComponent} from './components/tables/building-table/building-table.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { ProfileComponent } from './screens/profile/profile.component';
import { BuildingDetailsComponent } from './components/tables/building-table/building-details/building-details.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import { AutocompleteComponent } from './components/tables/building-table/building-details/auto-complete/auto-complete.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { FlatTableComponent } from './components/tables/flat-table/flat-table.component';
import { FlatDetailsComponent } from './components/tables/flat-table/flat-details/flat-details.component';
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import { RenterTableComponent } from './components/tables/renter-table/renter-table.component';
import { RenterDetailsComponent } from './components/tables/renter-table/renter-details/renter-details.component';
import { LeaseTableComponent } from './components/tables/lease-table/lease-table.component';
import { DatePipe } from '@angular/common';
import { LeaseDetailComponent } from './components/tables/lease-table/lease-detail/lease-detail.component';
import { AlterationTableComponent } from './components/tables/alteration-table/alteration-table.component';
import { AlterationDetailsComponent } from './components/tables/alteration-table/alteration-details/alteration-details.component';
import { FileTableComponent } from './components/tables/file-table/file-table.component';
import { BuildingsComponent } from './screens/buildings/buildings.component';
import { FlatsComponent } from './screens/flats/flats.component';
import { BackButtonComponent } from './components/utils/back-button/back-button.component';
import { LeasesComponent } from './screens/leases/leases.component';
import { AlterationsComponent } from './screens/alterations/alterations.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    IconButtonComponent,
    BuildingTableComponent,
    HomeComponent,
    ProfileComponent,
    BuildingDetailsComponent,
    AutocompleteComponent,
    FlatTableComponent,
    FlatDetailsComponent,
    RenterTableComponent,
    RenterDetailsComponent,
    LeaseTableComponent,
    LeaseDetailComponent,
    AlterationTableComponent,
    AlterationDetailsComponent,
    FileTableComponent,
    BuildingsComponent,
    FlatsComponent,
    BackButtonComponent,
    LeasesComponent,
    AlterationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    GoogleMapsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule

  ],
  providers: [AuthService, AuthGuard, MatSnackBar/*loginService*/,MatDialogModule,MatDatepickerModule,MatAutocompleteModule,DatePipe,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
