import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  private backendURL: string = 'http://localhost:4000';

  constructor() { }

  getVideogame(id: number): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[]
  }> {
    return this.http.get<{ status: number, statusText: string, apiResponse: any[] }>(`${this.backendURL}/get-game/${id}`);
  }

  getVideogameProfile(id: number): Observable<{
    status: number;
    statusText: string;
    apiResponse: any
  }> {
    return this.http.get<{ status: number, statusText: string, apiResponse: any[] }>(`${this.backendURL}/get-game-profile/${id}`);
  }

  search(limit: number, query: string, genres: number[] | undefined = undefined): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[]
  }> {
    return this.http.post<{ status: number, statusText: string, apiResponse: any[] }>(`${this.backendURL}/search`, {
      limit: limit,
      query: query,
      genreList: genres !== undefined ? genres : []
    });
  }

  getCoverURL(id: number, sizeType: string): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
    fullURL: string
  }> {
    return this.http.get<{
      status: number;
      statusText: string;
      apiResponse: any[];
      fullURL: string
    }>(`${this.backendURL}/cover/${id}/${sizeType}`);
  }

  getCoverList(idList: number[]): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
  }> {
    return this.http.post<{ status: number, statusText: string, apiResponse: any[] }>(
      `${this.backendURL}/covers`,
      {
        idList: idList !== undefined ? idList : [],
      }
    );
  }

  getReleaseYear(releaseDate: number): number {
    return new Date(releaseDate * 1000).getFullYear();
  }

  getVideogameProfileFromSlug(slug: string): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
  }> {
    return this.http.get<{
      status: number;
      statusText: string;
      apiResponse: any[];
    }>(`${this.backendURL}/get-videogame-profile-from-slug/${slug}`);
  }

  getVideogameInfoForCorousel(idList: number[]): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
  }> {
    return this.http.post<{ status: number, statusText: string, apiResponse: any[] }>(
      `${this.backendURL}/get-videogame-info-from-id-list`,
      {
        idList: idList !== undefined ? idList : [],
      }
    )
  }

  getPlatformNames(idList: number[]): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
  }> {
    return this.http.post<{ status: number, statusText: string, apiResponse: any[] }>(
      `${this.backendURL}/get-platform-names-from-id-list`,
      {
        idList: idList !== undefined ? idList : [],
      }
    );
  }

  getGenreNames(idList: number[]): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
  }> {
    return this.http.post<{ status: number, statusText: string, apiResponse: any[] }>(
      `${this.backendURL}/get-genre-names-from-id-list`,
      {
        idList: idList !== undefined ? idList : [],
      }
    );
  }

  getGenreAndPlatformNames(genreIdList: number[], platformIdList: number[]): Observable<{
    status: number;
    statusText: string;
    apiResponse: any[];
  }> {
    return this.http.post<{ status: number, statusText: string, apiResponse: any[] }>(
      `${this.backendURL}/get-genre-and-platform-names-from-id-lists`,
      {
        genreIdList: genreIdList,
        platformIdList: platformIdList
      }
    );
  }
}
