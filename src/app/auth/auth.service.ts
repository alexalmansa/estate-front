import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../model/user";
import {first, map} from "rxjs/operators";
import {loginService} from "../../services/login-service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private valuesUrl = environment.API_URL + '/users';
  // @ts-ignore
  public currentUser: Observable<User>;
  // @ts-ignore
  private currentUserSubject: BehaviorSubject<User>;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    public afAuth: AngularFireAuth
) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  login(user: User): Observable<any> {
    return this.http.post<any>(this.valuesUrl + '/login', user).pipe(map(user => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.loggedIn.next(true)
    return user;
      }
    ));
  }

  logout() {
    this.currentUserSubject.next(null);
    this.loggedIn.next(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
