import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private languageSubject = new BehaviorSubject<string>(localStorage.getItem("lang") || "es");
  language$ = this.languageSubject.asObservable();

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
    if (key === "lang") {
      this.languageSubject.next(value);
    }
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
}
