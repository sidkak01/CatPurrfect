import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkAuthState());
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.isLoggedInSubject = new BehaviorSubject<boolean>(this.checkAuthState());
    }
  }

  private checkAuthState(): boolean {
    // Only access localStorage in the browser, fix build errors
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!(token && user);
    }
    return false;
  }
  
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
  
  getLoggedInValue(): boolean {
    return this.isLoggedInSubject.value;
  }
  
  setLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }
}