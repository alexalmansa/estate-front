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
import {debounceTime, map, switchMap} from "rxjs/operators";
import {Renter} from "../../../../model/renter";
import {LeaseService} from "../../../../services/lease.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-lease-detail',
  templateUrl: './lease-detail.component.html',
  styleUrls: ['./lease-detail.component.css', '../../../shared.css']
})
export class LeaseDetailComponent implements OnInit {
  @ViewChild('flat', { read: MatAutocompleteTrigger }) triggerFlat: MatAutocompleteTrigger;
  public flatsFormControl = new FormControl();

  @ViewChild('renter', { read: MatAutocompleteTrigger }) triggerRenter: MatAutocompleteTrigger;
  public rentersFormControl = new FormControl();

  public lease: Lease

  private flatSelected: number;
  private renterSelected: number;

  public editing: boolean;
  public leaseForm: FormGroup;
  public loading: boolean;
  public allFlats: Flat[];
  public filteredFlats: Observable<Flat[]>;
  public allBuildings: Building[];
  public allRenters: Renter[];
  public filteredRenters: Observable<Renter[]>;

  public initialName: string;
  public initialRenter: string;
  flats: Observable<Flat[]>;
  renters: Observable<Renter[]>;

  public startDate: FormControl;
  public endDate: FormControl;


  constructor(public dialogRef: MatDialogRef<LeaseDetailComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public snackBar: MatSnackBar,
              private leaseService: LeaseService,
              private datePipe: DatePipe) {
    this.allFlats = this.data.allFlats;
    this.allBuildings = this.data.allBuildings;
    this.allRenters = this.data.allRenters;
    this.leaseForm = new FormGroup({});
    this.leaseForm = this.formBuilder.group({
      flat: ['', Validators.required],
      renter: ['', Validators.required],
      price: ['', Validators.required],
      deposit: ['', Validators.required]
    });
    this.lease = this.data.lease;

  }

  ngOnInit(): void {
    this.filteredFlats = this.flatsFormControl.valueChanges
      .pipe(
        map( ( x => this.filterFlats(x))))
    this.filteredRenters = this.rentersFormControl.valueChanges
      .pipe(
        map( ( x => this.filterRenters(x))))

    if (this.lease != null) {
      this.renterSelected = this.lease.renter_id;
      this.flatSelected = this.lease.flat_id;
      this.initialName = this.getFlatName(this.lease.flat_id);
      this.initialRenter = this.getRenterName(this.lease);
      this.startDate = new FormControl(new Date(this.lease.start_date))
      this.endDate = new FormControl(new Date(this.lease.end_date))

    }else {
      this.startDate = new FormControl()
      this.endDate = new FormControl()
    }
    if (this.data.edit) {
      this.editing = true;
    } else {
      this.editing = false;
    }
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

  filterRenters(filter: any) : Renter[]{
    if (filter != null && filter instanceof String) {
      filter = filter.toLowerCase()
    }
    let filteredRenters = [];
    this.allRenters.forEach(renter => {
      if (renter.name.toLowerCase().startsWith(filter)) {
        filteredRenters.push(renter);
      }
    })
    return filteredRenters

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

  getRenterName(lease : Lease) {
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

  onFocusSearchFlat() {
    this.triggerFlat._onChange(this.flatsFormControl.value);
    this.triggerFlat.openPanel();
  }
  onFocusSearchRenter() {
    this.triggerRenter._onChange(this.rentersFormControl.value);
    this.triggerRenter.openPanel();
  }

  displayFn = flat => {
    return flat ? this.getFlatName(flat.id) : this.initialName;
  }

  displayFnRenter = renter => {
    //TODO: NOT SURE
    return renter ? renter.name : this.initialRenter;
  }

  onFlatChanged(event: MatAutocompleteSelectedEvent) {
    this.flatSelected = event.option.value.id;
  }

  onRenterChanged(event: MatAutocompleteSelectedEvent) {
    this.renterSelected = event.option.value.id;
  }

  onClickSave(){
    this.loading = true;
    const newFlatId = this.flatSelected;
    const newRenterId = this.renterSelected;
    const newPrice = Number(this.leaseForm.get('price').value);
    const newStartDate = String(this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd'));
    const newEndDate = String(this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd'));
    const newDeposit = Number(this.leaseForm.get('deposit').value);

    if (this.isEditing()){
      let leaseUpdate = <Lease>({
        id: this.lease.id,
        price: newPrice,
        flat_id: newFlatId,
        renter_id: newRenterId,
        start_date: newStartDate,
        end_date: newEndDate,
        deposit:newDeposit
      })
      this.leaseService.updateLease(leaseUpdate).subscribe(() => {
        this.closeDialog();
      });
    }else {
      let newLease = <Lease>({
        price: newPrice,
        flat_id: newFlatId,
        renter_id: newRenterId,
        start_date: newStartDate,
        end_date: newEndDate,
        deposit:newDeposit
      })
      this.leaseService.postLease(newLease).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  onClickDelete(){
    if(confirm("Estas seguro que quieres eliminar este Contrato? ")) {

      this.leaseService.deleteLease(this.lease.id).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
