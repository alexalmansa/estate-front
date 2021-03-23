import { Component, OnInit } from '@angular/core';
import {BuildingService} from "../../services/building.service";
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";
import {Building} from "../../model/building";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {BuildingDetailsComponent} from "./building-details/building-details.component";

@Component({
  selector: 'building-table',
  templateUrl: './building-table.component.html',
  styleUrls: ['./building-table.component.css', '../shared.css']
})
export class BuildingTableComponent implements OnInit {
  tableColumns: string[] = [ 'check' ,'name', 'direction', 'info'];
  dataSource;
  selectedBuilding: Building;

  constructor(private buildingServiceService: BuildingService,
              public dialog: MatDialog,) {
    this.getBuildings()
  }

  ngOnInit(): void {
    console.log(this.dataSource)
  }

  getBuildings(){
    this.buildingServiceService.getbuildings().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
      })
  }

  onClickNew(){
    this.dialog.open(BuildingDetailsComponent, {
      width: '760px',
      data: {
        edit: false,
        create: true,
        building: this.selectedBuilding
      }
    });
  }

  onClickView(building: Building){

  }
  onSelectElement(element){
    this.selectedBuilding = element;
    console.log(this.selectedBuilding);
  }

}
