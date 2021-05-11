import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Building} from "../../../../model/building";
import {BuildingService} from "../../../../services/building.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GoogleMap} from "@angular/google-maps";

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.css', '../../../shared.css']
})
export class BuildingDetailsComponent implements OnInit, AfterViewInit {
  public editing: boolean;
  public building: Building;
  public buildingForm: FormGroup;
  public loading: boolean;
  public autocompleteInput: string;
  private place;

  @ViewChild('addresstext') addresstext: any;
  @ViewChild('map') map: GoogleMap;

  constructor(
    public dialogRef: MatDialogRef<BuildingDetailsComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buildingService: BuildingService,
    public snackBar: MatSnackBar,
  )
  {
    this.buildingForm = new FormGroup({});
    this.buildingForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.building = this.data.building;
    this.autocompleteInput = this.building?.address;
  }

  ngOnInit(): void {
    this.configureDialog();

  }

  ngAfterViewInit() {
    if (this.isEditing() && this.building.latitude != null && this.building.longitude != null){
      const coordinates = new google.maps.LatLng(this.building.latitude,this.building.longitude);
      var options: google.maps.MapOptions = {
        center: coordinates,
        zoom: 15,
      };
      this.map.googleMap.setOptions(options);
      const marker = new google.maps.Marker({
        position: coordinates,
        title: "Marker 1"
      });

      marker.setMap(this.map.googleMap);
    }
    this.getPlaceAutocomplete();
  }
  configureDialog() {
    // Get data from params open dialog
    if (this.data.edit) {
      this.editing = true;
    } else {
      this.editing = false;
    }
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'ES' },
        types: ["geocode"]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.place = autocomplete.getPlace();

      this.map.fitBounds(this.place.geometry.viewport);

        const marker = new google.maps.Marker({
          position: this.place.geometry.location,
          title: "Marker 1"
        });
        marker.setMap(this.map.googleMap);
        marker.setClickable(true);
      })
  }


  isEditing() {
    return this.editing;
  }

  get f() { return this.buildingForm.controls; }
  getAddress(event){
    console.log(event);
  }

  onClickSave(){

    if (this.buildingForm.invalid){
      return;
    }
    this.loading = true;
    const newName = this.buildingForm.get('name').value;
    const newAddress = this.buildingForm.get('address').value;
    let newBuilding;

    if (this.isEditing()){
      if (this.place != null) {
        const newAddress = this.place.formatted_address;
        newBuilding = <Building>({
          id: this.building.id,
          name: newName,
          address: newAddress,
          longitude: this.place.geometry.location.lng(),
          latitude: this.place.geometry.location.lat(),
        })
      } else {
        newBuilding = <Building>({
          id: this.building.id,
          name: newName,
          address: newAddress,
        })
      }

      this.buildingService.updateBuilding(newBuilding).subscribe(() => {
        this.closeDialog();
      });
    }else {
        newBuilding = <Building>({
          name: newName,
          address: newAddress,
          longitude: this.place.longitude,
          latitude: this.place.latitude
        })
      this.buildingService.postBuilding(newBuilding).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  onClickDelete(){
    if(confirm("Estas seguro que quieres eliminar este edificio? ")) {

      this.buildingService.deleteBuilding(this.building.id).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.snackBar.open("Edificio modificado correctamente", "OK");
  }
}
