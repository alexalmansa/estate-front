import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Building} from "../model/building";
import {Flat} from "../model/flat";

@Injectable({
  providedIn: 'root'
})
export class FlatService {
  private valuesUrl = environment.API_URL + '/flats';

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }
  getFlats(buildingId?: number): Observable<Flat[]> {
    let query = this.valuesUrl + '/frombuilding' + '?';
    if (buildingId != null) {
      query = query + 'building_id=' + buildingId;
    }
    return this.http.get<Flat[]>(query)
  }

  postFlat(flat: Flat){
    debugger
    return this.http.post(this.valuesUrl + '/create', flat)
  }

  updateFlat(flat: Flat){
    return this.http.put(this.valuesUrl + '/edit', flat)
  }

  deleteFlat(id: number){
    let httpParams = new HttpParams().set('flat_id', id.toString());
    let options = {params: httpParams};
    return this.http.delete(this.valuesUrl + '/delete', options)
  }
}
