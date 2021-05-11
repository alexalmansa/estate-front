import {Component, Input, OnInit} from '@angular/core';
import {Building} from "../../../model/building";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {FlatService} from "../../../services/flat.service";
import {BuildingDetailsComponent} from "../building-table/building-details/building-details.component";
import {Flat} from "../../../model/flat";
import {FlatDetailsComponent} from "./flat-details/flat-details.component";
import {BuildingService} from "../../../services/building.service";

@Component({
  selector: 'app-flat-table',
  templateUrl: './flat-table.component.html',
  styleUrls: ['./flat-table.component.css',  '../../shared.css']
})
export class FlatTableComponent implements OnInit {
  @Input() buildingId: number;
  tableColumns: string[] = ['building','floor', 'door_number', 'area', 'price', 'info'];
  dataSource;
  allBuildings;


  constructor(private flatService: FlatService,
              public dialog: MatDialog,
              private buildingService: BuildingService) {
    this.getFlats()
    this.buildingService.getbuildings().subscribe(buildings => {
      this.allBuildings = buildings;
    });
  }


  ngOnInit(): void {
  }

  getFlats() {
    this.flatService.getFlats().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
      })
  }

  onClickNew() {
    this.dialog.open(FlatDetailsComponent, {
      width: '760px',
      data: {
        edit: false,
        create: true,
      }
    });
  }

  onClickView(flat: Flat) {
    this.dialog.open(FlatDetailsComponent, {
      width: '760px',
      data: {
        edit: true,
        create: false,
        flat: flat
      }
    });
  }

  getBuildingName(flat: Flat) {
    let building_id = flat.building_id;
    let buildingOut;
    if (this.allBuildings != null) {
      this.allBuildings.forEach(function (building) {
        if (building.id == building_id) {
          buildingOut = building;
        }
      })
      return buildingOut.name;
    }
    return ""
  }
}
