import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../model/user";
import {first, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthService {
  private valuesUrl = environment.API_URL + '/users';
  // @ts-ignore
  public currentUser: Observable<any>;
  // @ts-ignore
  private currentUserSubject: BehaviorSubject<any>;

  get isLoggedIn() :boolean{
    return this.currentUser != null;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  login(user: User): Observable<any> {
    return this.http.post<any>(this.valuesUrl + '/login', user).pipe(map(user => {
        localStorage.setItem('currentUser', user.token);
        this.currentUserSubject.next(user);
        return user;
      }
    ));
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
  public getToken(): string {
    let token =  localStorage.getItem('currentUser' );
    if (token == null){
      this.logout();
      return '';
    }
    return token;
  }

  getUserRole(){

  }
}
