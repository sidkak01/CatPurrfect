import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Cat {
  name: string;
  weight: string | number;
  age: string | number;
  breed: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = 'http://localhost:5000/api';
  
  constructor(private http: HttpClient) {}

  getUserCats(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/cats`);
  }

  getAllCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/cats`);
  }

  getCatById(id: string): Observable<Cat> {
    return this.http.get<Cat>(`${this.apiUrl}/cat/${id}`);
  }

  addCat(cat: any, userId: string): Observable<any> {
    const catWithUserId = { ...cat, userId };
    return this.http.post<any>(`${this.apiUrl}/cats`, catWithUserId);
  }

  updateCat(id: string, cat: Partial<Cat>): Observable<Cat> {
    return this.http.put<Cat>(`${this.apiUrl}/cat/${id}`, cat);
  }

  deleteCat(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cat/${id}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cats/count`);
  }
}