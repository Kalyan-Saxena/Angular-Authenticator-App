import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url:string = 'http://localhost:5000/api';
  private userId: string = '';
  private isAuthenticated: boolean = false;
  private token: string = '';
  public tokenListener: Subject<boolean> = new Subject();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  public getTokenListner(): Observable<boolean> {
    return this.tokenListener.asObservable();
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public getToken(): string {
    return this.token;
  }

  public loginUser(userLoginDetails: { email: string; password: string; }) {
    const loginUrl = `${this.url}/users/login`;
    this.http.post<{token: string, user: User, message: string, expiresIn: number}>(loginUrl, userLoginDetails, httpOptions).subscribe({
      next: (value) => {
        console.log(value)
        const expireDuration = value.expiresIn;
        this.setAuthTimer(expireDuration);

        this.isAuthenticated = true;
        this.tokenListener.next(true);
        this.token = value.token;
        this.userId = value.user._id;

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expireDuration * 1000);
        this.saveAuthData(this.token, this.userId, expirationDate);
        this.router.navigate(['']);
      },
      error: (e) => {
        this.isAuthenticated = false;
        this.tokenListener.next(false);
        console.log(e.error.message)
      },
      complete: () => console.info('Login successful')
    })
  }

  public registerUser(user: { name: string; email: string; password: string; }) {
    const registerUrl = `${this.url}/users`;
    this.http.post(registerUrl, user, httpOptions).subscribe({
      next: (value) => {
        console.log(value)
        this.router.navigate(['login'])
      },
      error: (e) => {
        console.log(e.error.message)
      },
      complete: () => console.info('Registration completed')
    })
  }

  public logoutUser() {
    clearTimeout(this.tokenExpirationTimer);
    this.isAuthenticated = false;
    this.tokenListener.next(false);
    this.token = '';
    this.userId = '';
    this.clearAuthData();
    this.router.navigate(['login'])
  }

  private saveAuthData(token:string, userId: string, expiresIn: Date){
    localStorage.setItem("token",token);
    localStorage.setItem("userId",userId);
    localStorage.setItem("expirationDate", expiresIn.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
  }

  public getAuthData() {
    const tokenFromLocalStorage = localStorage.getItem("token")
    const userIdFromLocalStorage = localStorage.getItem("userId")
    const expirationDate = localStorage.getItem("expirationDate")

    if(!tokenFromLocalStorage || !userIdFromLocalStorage || !expirationDate) {
      return;
    }

    return {
      token: tokenFromLocalStorage,
      userId: userIdFromLocalStorage,
      expirationDate: new Date(expirationDate)
    }
  }

  public autoAuth() {
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this.tokenListener.next(true);
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn/1000)
    }
  }

  private setAuthTimer(durationInSeconds:any){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logoutUser();
    }, durationInSeconds * 1000);
  }
}
