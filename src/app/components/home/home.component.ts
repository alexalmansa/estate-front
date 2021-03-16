import { Component, OnInit } from '@angular/core';
import {BuildingService} from "../../services/building.service";
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";
import {Building} from "../../model/building";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tableColumns: string[] = [ 'name', 'direction', 'info'];
  buildings: Building[] ;

  constructor(private buildingServiceService: BuildingService) { }

  ngOnInit(): void {
    this.buildingServiceService.getbuildings().subscribe(building => {
      console.log(building);
        this.buildings=[{name: 'asds', address:'asdsfd', id:1, latitude:1.90786890, longitude:1.978665789}];
        console.log(building[0].name);
      this.buildings.push(building[0]);
    },
      error => {
      })
  }

}
