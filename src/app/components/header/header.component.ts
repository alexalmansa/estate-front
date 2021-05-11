import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() title?: string;

  constructor(private authService: AuthService,
              public router: Router) { }

  ngOnInit() {

  }

  onLogout(){
    this.authService.logout();
  }

  goToHome() {
    this.router.navigate(['/'])
  }
}
