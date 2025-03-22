import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
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