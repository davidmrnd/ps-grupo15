import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = 'database.json';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  getVideogames(category: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.videogames.filter((game: any) => game.category.includes(category)))
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.users)
    );
  }
}
