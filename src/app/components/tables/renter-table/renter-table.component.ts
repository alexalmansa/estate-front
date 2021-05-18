import { Component, OnInit } from '@angular/core';
import {Building} from "../../../model/building";
import {Renter} from "../../../model/renter";
import {MatTableDataSource} from "@angular/material/table";
import {BuildingService} from "../../../services/building.service";
import {MatDialog} from "@angular/material/dialog";
import {RenterService} from "../../../services/renter.service";
import {BuildingDetailsComponent} from "../building-table/building-details/building-details.component";
import {RenterDetailsComponent} from "./renter-details/renter-details.component";

@Component({
  selector: 'app-renter-table',
  templateUrl: './renter-table.component.html',
  styleUrls: ['./renter-table.component.css',  '../../shared.css']
})
export class RenterTableComponent implements OnInit {
  tableColumns: string[] = ['name', 'nif', 'info'];
  dataSource;
  selectedRenter: Renter;

  constructor(private renterService: RenterService,
              public dialog: MatDialog) {
    this.getRenters();
  }

  ngOnInit(): void {
  }

  getRenters(){
    this.renterService.getrenters().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
      })
  }

  onClickNew(){
    let dialog = this.dialog.open(RenterDetailsComponent, {
      width: '760px',
      data: {
        edit: false,
        create: true,
        renter: this.selectedRenter
      }
    });
    dialog.afterClosed().subscribe(() => {
      debugger;
      this.getRenters();
    });
  }

  onClickView(building: Building){
    let dialog = this.dialog.open(RenterDetailsComponent, {
      width: '760px',
      data: {
        edit: true,
        create: false,
        renter: building
      }
    });
    dialog.afterClosed().subscribe(() => {
      debugger;
      this.getRenters();
    });
  }
}
