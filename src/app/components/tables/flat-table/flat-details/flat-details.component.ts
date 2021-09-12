import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Building} from "../../../../model/building";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BuildingService} from "../../../../services/building.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FlatService} from "../../../../services/flat.service";
import {Flat} from "../../../../model/flat";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {Machine} from "../../../../../../../../../projectes/doorwifi-frontend/doorwifi-frontend/src/esat-frontend/src/app/classes/machines";
import {Observable} from "rxjs";
import {debounceTime, map, switchMap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-flat-details',
  templateUrl: './flat-details.component.html',
  styleUrls: ['./flat-details.component.css', '../../../shared.css']
})
export class FlatDetailsComponent implements OnInit {

  @ViewChild('building', { read: MatAutocompleteTrigger }) triggerBuilding: MatAutocompleteTrigger;

  errorFlats: boolean = false;
  emptyFlats: boolean = false;

  private buildingSelected: number;

  public editing: boolean;
  public flatForm: FormGroup;
  public loading: boolean;
  public flat: Flat;
  public initialName: string;
  public buildingsFormControl = new FormControl();
  public buildings;

  public filteredBuildings: Observable<Building[]>;


  constructor(public dialogRef: MatDialogRef<FlatDetailsComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private flatService: FlatService,
              public snackBar: MatSnackBar,
              private buildingService: BuildingService,
              public router: Router
              ) {
    this.flatForm = new FormGroup({});
    this.flatForm = this.formBuilder.group({
      building:['', Validators.required],
      price: ['', Validators.required],
      area: ['', Validators.required],
      floor: ['', Validators.required],
      door_number: ['', Validators.required],
      boiler_date: ['', Validators.required],
      boiler_description: ['', Validators.required],
      price_index: ['', Validators.required],

    });
    this.flat = this.data.flat;
    this.buildings = this.data.buildings;
    if (this.flat != null) {
      this.buildingSelected = this.flat.building_id;
      this.buildingService.getbuildings().subscribe(buildings => {
        let building_id = this.buildingSelected;
        let buildingOut;
        buildings.forEach(function (building) {
          if (building.id == building_id) {
            buildingOut = building;
          }
        })
        this.initialName = buildingOut.name;
      });
    }
  }

  ngOnInit(): void {
    if (this.data.edit) {
      this.editing = true;
    } else {
      this.editing = false;
    }
    this.filteredBuildings = this.buildingsFormControl.valueChanges
      .pipe(
        map((x => this.filterBuildings(x)))
      )
  }

  isEditing() {
    return this.editing;
  }

  onClickSave(){

    this.loading = true;
    const newBuildingId = this.buildingSelected;
    const newPrice = Number(this.flatForm.get('price').value);
    const newArea = Number(this.flatForm.get('area').value);
    const newFloor = Number(this.flatForm.get('floor').value);
    const newDoor = Number(this.flatForm.get('door_number').value);
    const newBoilerDate = this.flatForm.get('boiler_date').value;
    const newBoilerDescription = this.flatForm.get('boiler_description').value;
    const newIndexPrice = Number(this.flatForm.get('price_index').value);
    if (this.isEditing()){
    let flatUpdate = <Flat>({
      id: this.flat.id,
      building_id: newBuildingId,
      asked_price: newPrice,
      area: newArea,
      floor: newFloor,
      door_number: newDoor,
      boiler_date: newBoilerDate,
      boiler_description: newBoilerDescription,
      price_index: newIndexPrice
    })
      this.flatService.updateFlat(flatUpdate).subscribe(() => {
        this.closeDialog();
      });
    }else {
      let newFlat = <Flat>({
        building_id: newBuildingId,
        asked_price: newPrice,
        area: newArea,
        floor: newFloor,
        door_number: newDoor,
        boiler_date: newBoilerDate,
        boiler_description: newBoilerDescription,
        price_index: newIndexPrice
      })
      this.flatService.postFlat(newFlat).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  onClickDelete(){
    if(confirm("Estas seguro que quieres eliminar este edificio? ")) {

      this.flatService.deleteFlat(this.flat.id).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onFocusSearchBuilding() {
    this.triggerBuilding._onChange(this.buildingsFormControl.value);
    this.triggerBuilding.openPanel();
  }

  displayFn(building?: any): string | undefined {
    return building ? building.name : undefined;
  }

  onFlatChanged(event: MatAutocompleteSelectedEvent) {
    this.errorFlats = false;
    this.emptyFlats = false;
      this.buildingSelected = event.option.value.id;

     /*else if (!this.machineSelectedList.includes(event.option.value)) {
      this.errorFlats = true;
    }*/
  }

  onClickOpenLeases(){
    this.router.navigate(['/leases'], {
      queryParams: {
        flatId: this.flat.id
      },
      queryParamsHandling: 'merge',
    });
    this.dialogRef.close();
  }

  onClickOpenAlterations(){
    this.router.navigate(['/alterations'], {
      queryParams: {
        flatId: this.flat.id
      },
      queryParamsHandling: 'merge',
    });
    this.dialogRef.close();
  }

  filterBuildings(filter: any) : Building[]{
    if (filter != null && filter instanceof String) {
      filter = filter.toLowerCase()
    }
    let filteredBuildings = [];
    this.buildings.forEach(building => {
      if (building.name.toLowerCase().startsWith(filter)) {
        filteredBuildings.push(building);
      }
    })
    return filteredBuildings
  }
}
