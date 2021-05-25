import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Flat} from "../model/flat";
import {Alteration} from "../model/alteration";

@Injectable({
  providedIn: 'root'
})
export class AlterationService {
  private valuesUrl = environment.API_URL + '/alterations';

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  getAlterartions(flatId?: number): Observable<Alteration[]> {
    let query = this.valuesUrl + '/getAlterations' + '?';
    if (flatId != null) {
      query = query + 'flat_id=' + flatId;
    }
    return this.http.get<Alteration[]>(query)
  }

  postAlteration(alteration: Alteration){
    return this.http.post(this.valuesUrl + '/create', alteration)
  }

  updateAlteration(alteration: Alteration){
    return this.http.put(this.valuesUrl + '/edit', alteration)
  }

  deleteAlteration(id: number){
    let httpParams = new HttpParams().set('alteration_id', id.toString());
    let options = {params: httpParams};
    return this.http.delete(this.valuesUrl + '/delete', options)
  }
}
