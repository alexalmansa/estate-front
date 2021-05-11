import {Component, Inject, OnInit} from '@angular/core';
import {Building} from "../../../../model/building";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Renter} from "../../../../model/renter";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BuildingService} from "../../../../services/building.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RenterService} from "../../../../services/renter.service";

@Component({
  selector: 'app-renter-details',
  templateUrl: './renter-details.component.html',
  styleUrls: ['./renter-details.component.css', '../../../shared.css']
})
export class RenterDetailsComponent implements OnInit {
  public editing: boolean;
  public renter: Renter;
  public renterForm: FormGroup;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<RenterDetailsComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private renterService: RenterService,
              public snackBar: MatSnackBar,) {
    this.renterForm = new FormGroup({});
    this.renterForm = this.formBuilder.group({
      name: ['', Validators.required],
      nif: ['', Validators.required]
    });
    this.renter = this.data.renter;
  }

  ngOnInit(): void {
    this.configureDialog();

  }

  configureDialog() {
    // Get data from params open dialog
    if (this.data.edit) {
      this.editing = true;
    } else {
      this.editing = false;
    }
  }

  isEditing() {
    return this.editing;
  }

  onClickSave() {


    this.loading = true;
    const newName = this.renterForm.get('name').value;
    const newAddress = this.renterForm.get('nif').value;
    let newRenter;

    if (this.isEditing()) {

      newRenter = <Renter>({
        id: this.renter.id,
        name: newName,
        nif: newAddress
      })

      this.renterService.updateRenter(newRenter).subscribe(() => {
        this.closeDialog();
      });
    } else {
      newRenter = <Renter>({
        name: newName,
        nif: newAddress
      })
      this.renterService.postRenter(newRenter).subscribe(() => {
        this.closeDialog();
      });
    }
  }
  onClickDelete(){
    if(confirm("Estas seguro que quieres eliminar este inquilino? ")) {

      this.renterService.deleteRenter(this.renter.id).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.snackBar.open("Inquilino modificado correctamente", "OK");
  }

  close(){
    this.dialogRef.close();
  }
}
