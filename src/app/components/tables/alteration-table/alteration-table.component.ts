import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {Building} from "../../../model/building";
import {Flat} from "../../../model/flat";
import {FlatService} from "../../../services/flat.service";
import {MatDialog} from "@angular/material/dialog";
import {BuildingService} from "../../../services/building.service";
import {MatTableDataSource} from "@angular/material/table";
import {debounceTime, map, switchMap} from "rxjs/operators";
import {FlatDetailsComponent} from "../flat-table/flat-details/flat-details.component";
import {Alteration} from "../../../model/alteration";
import {AlterationService} from "../../../services/alteration.service";
import {DatePipe} from "@angular/common";
import {RenterDetailsComponent} from "../renter-table/renter-details/renter-details.component";
import {AlterationDetailsComponent} from "./alteration-details/alteration-details.component";

@Component({
  selector: 'app-alteration-table',
  templateUrl: './alteration-table.component.html',
  styleUrls: ['./alteration-table.component.css', '../../shared.css']
})
export class AlterationTableComponent implements OnInit {

  @ViewChild('flat', { read: MatAutocompleteTrigger }) triggerFlat: MatAutocompleteTrigger;
  allFlats;
  public initialName: string;
  public flatsFormControl = new FormControl();
  flats: Observable<Flat[]>;
  public filteredFlats: Observable<Flat[]>;



  @Input() flatId: number;
  tableColumns: string[] = ['flat','alter_date', 'price', 'info'];
  dataSource;
  alterations: Alteration[];
  allBuildings;


  constructor(private alterationService: AlterationService,
              public dialog: MatDialog,
              private flatService: FlatService,
              private buildingService: BuildingService,
              private datePipe: DatePipe) {
    this.getInfo()

  }

  ngOnInit(): void {
    this.filteredFlats = this.flatsFormControl.valueChanges
      .pipe(
        map( ( x => this.filterFlats(x))))

    this.getAlterations()
  }

  getAlterations() {
    this.alterationService.getAlterartions(this.flatId).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.alterations = data;
      },
      error => {
      })
  }

  getInfo(){
    this.flatService.getFlats().subscribe(flats => {
      this.allFlats = flats
      let flat_id = this.flatId;
      let flatOut;
      flats.forEach(function (flat) {
        if (flat.id == flat_id) {
          flatOut = flat;
        }
      })
      if (flatOut != null){
        this.initialName = flatOut.name;
      }
    });
    this.flats = this.flatsFormControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value: string) => {
          return this.flatService.getFlats();
        })
      );
    this.buildingService.getbuildings().subscribe(buildings => {
      this.allBuildings = buildings;
    });
  }

  filterFlats(filter: any) : Flat[]{
    if (filter != null && filter instanceof String) {
      filter = filter.toLowerCase()
    }
    let filteredFlats = [];
    this.allFlats.forEach(flat => {
      if (this.getFlatName(flat.id).toLowerCase().startsWith(filter)) {
        filteredFlats.push(flat);
      }
    })
    return filteredFlats
  }

  onFocusSearchFlat() {
    this.triggerFlat._onChange(this.flatsFormControl.value);
    this.triggerFlat.openPanel();
  }

  displayFn = flat => {
    return flat ? this.getFlatName(flat.id) : undefined;
  }

  onTextChanged(newText: string){
    if (newText == ""){
      this.flatId = null;
      this.getAlterations()
    }

  }
  onFlatChanged(event: MatAutocompleteSelectedEvent) {
    this.flatId = event.option.value.id;
    this.getAlterations();
  }

  getFlatName(flatId: number) {
    let buildingOut, flatOut;
    if (this.allBuildings != null && this.allFlats != null) {
      this.allFlats.forEach(function (flat) {
        if (flat.id == flatId) {
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

  onClickNew() {
    let dialog = this.dialog.open(AlterationDetailsComponent, {
      width: '760px',
      data: {
        edit: false,
        allFlats: this.allFlats,
        allBuildings: this.allBuildings,
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.getAlterations();
    });
  }

  onClickView(alteration: Alteration) {
    let dialog = this.dialog.open(AlterationDetailsComponent, {
      width: '760px',
      data: {
        edit: true,
        alteration: alteration,
        allFlats: this.allFlats,
        allBuildings: this.allBuildings
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.getAlterations();
    });
  }

  getDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
