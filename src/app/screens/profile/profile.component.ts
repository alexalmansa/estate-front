import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../model/user";
import {UserRegister} from "../../model/user-register";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChangePassword} from "../../model/change-password";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../components/shared.css']
})
export class ProfileComponent implements OnInit {

  public isAdmin: boolean = false;
  public email: FormControl;
  public password: FormControl;
  public newPassword: FormControl;
  public newPasswordRepeat: FormControl;
  public changePassGroup: FormGroup;
  private user: User;
  public minPassLength = 4;

  public groupRegister: FormGroup;
  public emailRegister: FormControl;
  public passwordRegister: FormControl;
  public passwordRegisterRepeat: FormControl;
  public errorPasswords: boolean = false;

  constructor(builder: FormBuilder,
             public auth: AuthService,
              public snackBar: MatSnackBar,) {
    //Password change
    this.email = new FormControl('',
      Validators.compose([Validators.required])
    );

    this.password = new FormControl('',
      Validators.compose([Validators.required, Validators.minLength(this.minPassLength)]));

    this.newPassword = new FormControl('',
      Validators.compose([Validators.required, Validators.minLength(this.minPassLength)]));

    this.newPasswordRepeat = new FormControl('',
      Validators.compose([Validators.required, Validators.minLength(this.minPassLength)]));

    this.changePassGroup = builder.group({
      email: this.email,
      password: this.password,
      newPassword: this.newPassword,
      newPasswordRepeat: this.newPasswordRepeat
    });

    //User register
    this.emailRegister = new FormControl('',
      Validators.compose([Validators.required])
    );

    this.passwordRegister = new FormControl('',
      Validators.compose([Validators.required, Validators.minLength(this.minPassLength)])
    );
    this.passwordRegisterRepeat = new FormControl('',
      Validators.compose([Validators.required, Validators.minLength(this.minPassLength)])
    );
    this.groupRegister = builder.group({
      emailRegister: this.emailRegister,
      passwordRegister: this.passwordRegister,
      passwordRegisterRepeat: this.passwordRegisterRepeat
    });
  }

  ngOnInit(): void {
    this.auth.getMe().subscribe(user => {
      this.user = user;
      this.changePassGroup.patchValue({email:this.user.email});
      if (user.role == this.auth.ROLE_ADMIN) {
        this.isAdmin = true;
      }
    })
  }

  onSubmit() {
    console.log(this.changePassGroup.value);
  }

  registerUser(){
    const newEmail = this.emailRegister.value;
    const newPass = this.passwordRegister.value;
    const newPassRepeat = this.passwordRegisterRepeat.value;
    if (newPass != newPassRepeat){
      this.errorPasswords = true;
    }else {
      const registerUser = <UserRegister>{
        email: newEmail,
        password: newPass,
        password_confirm: newPassRepeat
      }
      this.auth.registerUser(registerUser).subscribe(() => {
        this.snackBar.open("Usuario creado correctamente", "OK");
      })
    }
  }

  changePassword(){
    //TODO: ADD hash function
    const oldPass = this.password.value;
    const newPass = this.newPassword.value;
    const newPassRepeat = this.newPasswordRepeat.value;
    const passwordChange = <ChangePassword>{
      password_old: oldPass,
      password: newPass,
      password_confirm: newPassRepeat
    }
    this.auth.changePassword(passwordChange).subscribe(() => {
      this.snackBar.open("Contraseña cambiada correctamente", "OK");
    });
  }
}
