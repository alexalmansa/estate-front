import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  private formSubmitAttempt: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  isFieldInvalid(field: string) {
    return (
      // @ts-ignore
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      // @ts-ignore
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {

      this.authService.login(this.form.value)
        .subscribe(
          data => {
            this.router.navigate(['/']);
          },
          error => {
            this.snackBar.open('Login incorrecto', 'OK', {
              duration: 3000
            });
          });
    }
    this.formSubmitAttempt = true;
  }
}
