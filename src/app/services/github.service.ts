//github.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { User } from '../models/user.model';
import { Repository } from '../models/repository.model';
import { CacheService } from './cache.service';
import { EMPTY ,throwError} from 'rxjs';
//import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public apiUrl = 'https://api.github.com';

  //Add github access token if the rate limit exceeds.
  //private accessToken = environment.API_ACCESS_TOKEN || '';
  private accessToken = '';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getUser(username: string): Observable<User> {
    const cachedUser = this.cacheService.get(`user_${username}`);
    if (cachedUser) {
      return of(cachedUser);
    } else {
      let headers = {};
      if (this.accessToken) {
        headers = new HttpHeaders({
          Authorization: `token ${this.accessToken}`
        });
      }
      return this.http.get<User>(`${this.apiUrl}/users/${username}`, { headers }).pipe(
        catchError(error => {
          // Handle API call failure
          console.error('Failed to fetch user:', error);
          if (error.status === 404) {
            return throwError(() => error); // Return an empty observable for 404 status
          } else if (error.status === 401) {
            return throwError(() => new Error('Invalid or missing access token')); // Return error for invalid or missing access token
          } else if (error.status === 403 && error.error.message.includes('rate limit exceeded')) {
            return throwError(() => new Error('Rate limit exceeded. Please add a valid access token.')); // Return error for rate limit exceeded
          } else {
            return EMPTY; // Return the error for other errors
          }
        })
      );
    }
  }
  
  getRepositories(username: string, page: number, perPage: number): Observable<Repository[]> {
    const cacheKey = `repos_${username}_page_${page}_perPage_${perPage}`;
    const cachedRepos = this.cacheService.get(cacheKey);
    if (cachedRepos) {
      return of(cachedRepos);
    } else {
      let headers = {};
      if (this.accessToken) {
        headers = new HttpHeaders({
          Authorization: `token ${this.accessToken}`
        });
      }
      return this.http.get<Repository[]>(`${this.apiUrl}/users/${username}/repos?page=${page}&per_page=${perPage}`, { headers }).pipe(
        catchError(error => {
          if (error.status === 403 && error.error.message.includes('rate limit exceeded')) {
            return throwError(() => new Error('Rate limit exceeded. Please add a valid access token.')); // Return error for rate limit exceeded
          } else {
            return of([]); // Return empty array for other errors
          }
        })
      );
    }
  }
}  



