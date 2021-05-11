import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Building} from "../model/building";
import {Renter} from "../model/renter";

@Injectable({
  providedIn: 'root'
})
export class RenterService {
  private valuesUrl = environment.API_URL + '/renters';


  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  getrenters(): Observable<Renter[]> {
    return this.http.get<Renter[]>(this.valuesUrl + '/getRenter')
  }

  postRenter(renter: Renter){
    return this.http.post(this.valuesUrl + '/create', renter)
  }

  updateRenter(renter: Renter){
    return this.http.put(this.valuesUrl + '/edit', renter)
  }

  deleteRenter(id: number){
    let httpParams = new HttpParams().set('renter_id', id.toString());
    let options = {params: httpParams};
    return this.http.delete(this.valuesUrl + '/delete', options)
  }
}
