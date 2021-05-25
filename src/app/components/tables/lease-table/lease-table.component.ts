import {Component, OnInit, ViewChild} from '@angular/core';
import {FlatService} from "../../../services/flat.service";
import {MatDialog} from "@angular/material/dialog";
import {BuildingService} from "../../../services/building.service";
import {MatTableDataSource} from "@angular/material/table";
import {RenterService} from "../../../services/renter.service";
import {LeaseService} from "../../../services/lease.service";
import {FlatDetailsComponent} from "../flat-table/flat-details/flat-details.component";
import {Flat} from "../../../model/flat";
import {Lease} from "../../../model/lease";
import {browser} from "protractor";
import {DatePipe} from "@angular/common";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {LeaseDetailComponent} from "./lease-detail/lease-detail.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-lease-table',
  templateUrl: './lease-table.component.html',
  styleUrls: ['./lease-table.component.css', '../../shared.css']
})
export class LeaseTableComponent implements OnInit {
  @ViewChild('butonPast') buttonPast: MatButton;

  tableColumns: string[] = ['flat','renter', 'price', 'start_date', 'end_date', 'deposit', 'info'];
  dataSource;
  allFlats;
  allRenters;
  allBuildings;
  pastLeases = true;
  constructor(private flatService: FlatService,
              public dialog: MatDialog,
              private renterService: RenterService,
              private buildingService: BuildingService,
              private leasesService: LeaseService,
              private datePipe: DatePipe) {
      this.gettAllInfo();
      this.getLeases()
  }

  ngOnInit(): void {
  }

  getLeases() {
    this.leasesService.getLeases(this.pastLeases).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
      })
  }
  gettAllInfo(){
    this.flatService.getFlats().subscribe(data => {
        this.allFlats = data;
      },
      error => {
      });
    this.renterService.getrenters().subscribe(data => {
      this.allRenters = data;
    });
    this.buildingService.getbuildings().subscribe(buildings => {
      this.allBuildings = buildings;
    });
  }

  onClickPastLeases(){
    this.pastLeases = !this.pastLeases;
    if (this.pastLeases){
      this.buttonPast.color = "primary";
    }else{
      this.buttonPast.color = "accent";
    }
    this.getLeases();
  }

  onClickNew() {
   let dialog =  this.dialog.open(LeaseDetailComponent, {
      width: '760px',
      data: {
        edit: false,
        allFlats: this.allFlats,
        allBuildings: this.allBuildings,
        allRenters: this.allRenters
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.getLeases();
    });
  }

  onClickView(lease: Lease) {
    let dialog = this.dialog.open(LeaseDetailComponent, {
      width: '760px',
      data: {
        edit: true,
        lease: lease,
        allFlats: this.allFlats,
        allBuildings: this.allBuildings,
        allRenters: this.allRenters
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.getLeases();
    });
  }

  getFlatName(lease: Lease) {
    let buildingOut, flatOut;

    if (this.allBuildings != null && this.allFlats != null) {
      this.allFlats.forEach(function (flat) {
        if (flat.id == lease.flat_id) {
          flatOut = flat;
        }
      })
      this.allBuildings.forEach(function (building) {
        if (building.id == flatOut.building_id) {
          buildingOut = building;
        }
      })
      return  buildingOut.name + ", " + flatOut.floor + "º " + flatOut.door_number + "ª" ;
    }
    return ""
  }

  getRenterName(lease :Lease) {
    let renterOut;
    if (this.allRenters != null) {
      this.allRenters.forEach(function (renter) {
        if (renter.id == lease.renter_id) {
          renterOut = renter;
        }
      })
      return renterOut.name;
    }
    return ""
  }

  getDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
