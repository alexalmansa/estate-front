import { Component, OnInit } from '@angular/core';
import {BuildingService} from "../../../services/building.service";

import {Building} from "../../../model/building";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {BuildingDetailsComponent} from "./building-details/building-details.component";

@Component({
  selector: 'building-table',
  templateUrl: './building-table.component.html',
  styleUrls: ['./building-table.component.css', '../../shared.css']
})
export class BuildingTableComponent implements OnInit {
  tableColumns: string[] = ['name', 'direction', 'info'];
  dataSource;
  selectedBuilding: Building;
  constructor(private buildingServiceService: BuildingService,
              public dialog: MatDialog) {
    this.getBuildings()
  }

  ngOnInit(): void {

  }

  getBuildings(){
    this.buildingServiceService.getbuildings().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
      })
  }

  onClickNew(){
    let dialogref = this.dialog.open(BuildingDetailsComponent, {
      width: '760px',
      data: {
        edit: false,
        create: true,
        building: this.selectedBuilding
      }
    });
    dialogref.afterClosed().subscribe(() => {
      this.getBuildings();
    });
  }

  onClickView(building: Building){
    let dialogref = this.dialog.open(BuildingDetailsComponent, {
      width: '760px',
      data: {
        edit: true,
        create: false,
        building: building
      }
    });
    dialogref.afterClosed().subscribe(() => {
      this.getBuildings();
    });
  }
}
