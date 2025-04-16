import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '/assets/database.json';
  constructor(private http: HttpClient) {}

  getVideogames(category: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.videogames.filter((game: any) => game.category.includes(category)))
    );
  }

  getVideogameById(id: number): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.videogames.find((game: any) => game.id === id))
    );
  }

  getUsersById(id: number ): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.users.find((user: any) => user.id === id))
    );
  }

  getCommentsByVideogameId(id: number): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.comments.filter((comment: any) => comment.videogameId === id))
    );
  }

  getCommentsByUserId(id: number): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => data.comments.filter((comment: any) => comment.userId === id))
    );
  }

}
