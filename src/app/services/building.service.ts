import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
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
    return this.http.get<Building[]>(this.valuesUrl + '/getBuilding')
  }

  postBuilding(building: Building){
    return this.http.post(this.valuesUrl + '/create', building)
  }

  updateBuilding(building: Building){
    return this.http.put(this.valuesUrl + '/edit', building)
  }

  deleteBuilding(id: number){
      let httpParams = new HttpParams().set('building_id', id.toString());
      let options = {params: httpParams};
      return this.http.delete(this.valuesUrl + '/delete', options)
  }
}
