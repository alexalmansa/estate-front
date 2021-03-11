import { Injectable } from '@angular/core';
import {User} from "../app/model/user";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class loginService {
  private valuesUrl = environment.API_URL + '/users';

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<Object> {
    return this.http.post(this.valuesUrl + '/login', user);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
}
