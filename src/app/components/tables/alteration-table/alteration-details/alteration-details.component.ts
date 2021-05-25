import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Lease} from "../../../../model/lease";
import {Flat} from "../../../../model/flat";
import {Observable} from "rxjs";
import {Building} from "../../../../model/building";
import {Renter} from "../../../../model/renter";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LeaseService} from "../../../../services/lease.service";
import {DatePipe} from "@angular/common";
import {map} from "rxjs/operators";
import {AlterationService} from "../../../../services/alteration.service";
import {Alteration} from "../../../../model/alteration";

@Component({
  selector: 'app-alteration-details',
  templateUrl: './alteration-details.component.html',
  styleUrls: ['./alteration-details.component.css', '../../../shared.css']
})
export class AlterationDetailsComponent implements OnInit {

  @ViewChild('flat', { read: MatAutocompleteTrigger }) triggerFlat: MatAutocompleteTrigger;
  public flatsFormControl = new FormControl();


  public alteration: Alteration

  private flatSelected: number;

  public editing: boolean;
  public leaseForm: FormGroup;
  public loading: boolean;
  public allFlats: Flat[];
  public filteredFlats: Observable<Flat[]>;
  public allBuildings: Building[];


  public initialName: string;
  flats: Observable<Flat[]>;

  public date: FormControl;


  constructor(public dialogRef: MatDialogRef<AlterationDetailsComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public snackBar: MatSnackBar,
              private alterationService: AlterationService,
              private datePipe: DatePipe) {
    this.allFlats = this.data.allFlats;
    this.allBuildings = this.data.allBuildings;
    this.leaseForm = new FormGroup({});
    this.leaseForm = this.formBuilder.group({
      flat: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.alteration = this.data.alteration;
    this.leaseForm.patchValue({description: this.alteration.description});
  }

  ngOnInit(): void {
    this.filteredFlats = this.flatsFormControl.valueChanges
      .pipe(
        map( ( x => this.filterFlats(x))))

    if (this.alteration != null) {
      this.flatSelected = this.alteration.flat_id;
      this.initialName = this.getFlatName(this.alteration.flat_id);
      this.date = new FormControl(new Date(this.alteration.alter_date))

    }else {
      this.date = new FormControl()
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
    this.triggerFlat._onChange(this.flatsFormControl.value);
    this.triggerFlat.openPanel();
  }


  displayFn = flat => {
    return flat ? this.getFlatName(flat.id) : this.initialName;
  }

  onFlatChanged(event: MatAutocompleteSelectedEvent) {
    this.flatSelected = event.option.value.id;
  }

  onClickSave(){
    this.loading = true;
    const newFlatId = this.flatSelected;
    const newPrice = Number(this.leaseForm.get('price').value);
    const newStartDate = String(this.datePipe.transform(this.date.value, 'yyyy-MM-dd'));
    const newDescription = String(this.leaseForm.get('description').value);

    if (this.isEditing()){
      let alterationUpdate = <Alteration>({
        id: this.alteration.id,
        price: newPrice,
        flat_id: newFlatId,
        alter_date: newStartDate,
        description: newDescription
      })
      this.alterationService.updateAlteration(alterationUpdate).subscribe(() => {
        this.closeDialog();
      });
    }else {
      let newAlteration = <Alteration>({
        price: newPrice,
        flat_id: newFlatId,
        alter_date: newStartDate,
        description: newDescription
      })
      this.alterationService.postAlteration(newAlteration).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  onClickDelete(){
    if(confirm("Estas seguro que quieres eliminar esta Reforma? ")) {

      this.alterationService.deleteAlteration(this.alteration.id).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
