import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Lease} from '../model/lease';

@Injectable({
  providedIn: 'root'
})
export class LeaseService {
  private valuesUrl = environment.API_URL + '/leases';

  constructor(private router: Router,
              private http: HttpClient,) { }

  getLeases(): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.valuesUrl + '/getLease')
  }

  postLease(lease: Lease){
    return this.http.post(this.valuesUrl + '/create', lease)
  }

  updateLease(lease: Lease){
    return this.http.put(this.valuesUrl + '/edit', lease)
  }

  deleteLease(id: number){
    let httpParams = new HttpParams().set('lease_id', id.toString());
    let options = {params: httpParams};
    return this.http.delete(this.valuesUrl + '/delete', options)
  }
}
