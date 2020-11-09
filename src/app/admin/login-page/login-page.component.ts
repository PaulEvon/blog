import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {ErrorStateMatcher} from "@angular/material/core";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {
  waitingResponse
  form: FormGroup
  matcher = new MyErrorStateMatcher();
  constructor(
    public auth: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.waitingResponse = true
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }
    this.auth.login(user).subscribe(() => {
      this.form.reset()
      this.router.navigate(['/admin', 'dashboard'])
      this.waitingResponse = false
    })
  }
}
