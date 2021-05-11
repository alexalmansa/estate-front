import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Flat} from "../../../../model/flat";
import {Observable} from "rxjs";
import {Building} from "../../../../model/building";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FlatService} from "../../../../services/flat.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BuildingService} from "../../../../services/building.service";
import {Lease} from "../../../../model/lease";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {debounceTime, switchMap} from "rxjs/operators";
import {Renter} from "../../../../model/renter";
import {LeaseService} from "../../../../services/lease.service";

@Component({
  selector: 'app-lease-detail',
  templateUrl: './lease-detail.component.html',
  styleUrls: ['./lease-detail.component.css', '../../../shared.css']
})
export class LeaseDetailComponent implements OnInit {
  @ViewChild('flat', { read: MatAutocompleteTrigger }) triggerFlat: MatAutocompleteTrigger;
  public flatsFormControl = new FormControl();

  public lease: Lease

  private flatSelected: number;

  public editing: boolean;
  public leaseForm: FormGroup;
  public loading: boolean;
  public allFlats: Flat[];
  public allBuildings: Building[];
  public allRenters: Renter[];

  public initialName: string;
  public buildingsFormControl = new FormControl();
  flats: Observable<Flat[]>;


  constructor(public dialogRef: MatDialogRef<LeaseDetailComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public snackBar: MatSnackBar,
              private leaseService: LeaseService) {
    this.allFlats = this.data.allFlats;
    this.allBuildings = this.data.allBuildings;
    this.allRenters = this.data.allRenters;
    this.leaseForm = new FormGroup({});
    this.leaseForm = this.formBuilder.group({
      flat: ['', Validators.required],
      renter: ['', Validators.required],
      price: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      deposit: ['', Validators.required]
    });
    this.lease = this.data.lease;

  }

  ngOnInit(): void {
   /* this.flats = this.buildingsFormControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value: string) => {
          return this.getFlatName();
        })
      );
    */
    if (this.lease != null) {
      this.initialName = this.getFlatName(this.lease.flat_id);

    }
    if (this.data.edit) {
      this.editing = true;
    } else {
      this.editing = false;
    }
  }

  isEditing() {
    return this.editing;
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
      return buildingOut.name + ", " + flatOut.floor + "º " + flatOut.door_number + "ª";
    }
    return ""
  }

  onFocusSearchFlat() {
    this.triggerFlat._onChange(this.buildingsFormControl.value);
    this.triggerFlat.openPanel();
  }

  displayFn = flat => {
    debugger
    return flat ? this.getFlatName(flat.id) : this.initialName;
  }

  onFlatChanged(event: MatAutocompleteSelectedEvent) {
    this.flatSelected = event.option.value.id;
    /*else if (!this.machineSelectedList.includes(event.option.value)) {
     this.errorFlats = true;
   }*/

  }

  onClickSave(){

  }

  onClickDelete(){
    if(confirm("Estas seguro que quieres eliminar este edificio? ")) {

      this.leaseService.deleteLease(this.lease.id).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
