import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Building} from "../../../model/building";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {FlatService} from "../../../services/flat.service";
import {BuildingDetailsComponent} from "../building-table/building-details/building-details.component";
import {Flat} from "../../../model/flat";
import {FlatDetailsComponent} from "./flat-details/flat-details.component";
import {BuildingService} from "../../../services/building.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {debounceTime, switchMap} from "rxjs/operators";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";

@Component({
  selector: 'app-flat-table',
  templateUrl: './flat-table.component.html',
  styleUrls: ['./flat-table.component.css',  '../../shared.css']
})
export class FlatTableComponent implements OnInit {
  @ViewChild('building', { read: MatAutocompleteTrigger }) triggerBuilding: MatAutocompleteTrigger;
  allBuildings;
  public initialName: string;
  public buildingsFormControl = new FormControl();
  buildings: Observable<Building[]>;


  @Input() buildingId: number;
  tableColumns: string[] = ['building','floor', 'door_number', 'area', 'price', 'info'];
  dataSource;
  flats: Flat[];

  constructor(private flatService: FlatService,
              public dialog: MatDialog,
              private buildingService: BuildingService) {
    this.getBuildings()

  }

  ngOnInit(): void {
    this.getFlats()
  }

  getFlats() {
    this.flatService.getFlats(this.buildingId).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.flats = data;
      },
      error => {
      })
  }

  getBuildings(){
    this.buildingService.getbuildings().subscribe(buildings => {
      this.allBuildings = buildings
      let building_id = this.buildingId;
      let buildingOut;
      buildings.forEach(function (building) {
        if (building.id == building_id) {
          buildingOut = building;
        }
      })
      if (buildingOut != null){
        this.initialName = buildingOut.name;
      }
    });
    this.buildings = this.buildingsFormControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value: string) => {
          return this.buildingService.getbuildings();
        })
      );
  }

  onFocusSearchBuilding() {
    this.triggerBuilding._onChange(this.buildingsFormControl.value);
    this.triggerBuilding.openPanel();
  }

  displayFn(building?: any): string | undefined {
    return building ? building.name : undefined;
  }

  onTextChanged(newText: string){
    if (newText == ""){
      this.buildingId = null;
      this.getFlats()
    }

  }
  onFlatChanged(event: MatAutocompleteSelectedEvent) {
    this.buildingId = event.option.value.id;
    this.getFlats();
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

  onClickNew() {
    let dialog = this.dialog.open(FlatDetailsComponent, {
      width: '760px',
      data: {
        edit: false,
        create: true,
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.getFlats();
    });
  }

  onClickView(flat: Flat) {
    let dialog = this.dialog.open(FlatDetailsComponent, {
      width: '760px',
      data: {
        edit: true,
        create: false,
        flat: flat
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.getFlats();
    });
  }
}
