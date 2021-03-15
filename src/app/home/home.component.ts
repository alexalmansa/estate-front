import { Component, OnInit } from '@angular/core';
import {BuildingServiceService} from "../../services/building-service.service";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = ;

  constructor(private buildingServiceService: BuildingServiceService) { }

  ngOnInit(): void {
    this.buildingServiceService.getbuildings().subscribe(building => {
      console.log(building);
    })
  }

}
