import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Building} from "../model/building";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private valuesUrl = environment.API_URL + '/buildings';


  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  getbuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.valuesUrl + '/getBuilding').pipe(map(buildings => {
        return buildings;
      }
    ));
  }
}
