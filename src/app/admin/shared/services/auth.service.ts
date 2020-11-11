import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FirebaseAuthResponse, User} from "../../../shared/interfaces";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";


@Injectable({providedIn: "root"})
export class AuthService {
  error$: Subject<any> = new Subject<any>()
  constructor(private http: HttpClient) { }
  get token(): string {
    const expDate = localStorage.getItem('fb-token-exp')
    if (new Date().toString() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error)
    const {message} = error.error.error
    if (message) {
      console.log(message)
      switch (message) {
        case "EMAIL_NOT_FOUND":
          this.error$.next('no such email')
          break
        case "INVALID_PASSWORD":
          this.error$.next('wrong password')
          break
      }
      return throwError(error)
    }
  }
  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }
  logout() {
    this.setToken(null)
  }
  isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(response : FirebaseAuthResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }

  }
}
