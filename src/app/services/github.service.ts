//github.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Repository } from '../models/repository.model';
import { CacheService } from './cache.service';
//import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root' 
})
export class GithubService {
  public apiUrl = 'https://api.github.com'; // Base URL for GitHub API

  //Add github access token if the rate limit exceeds.
  //private accessToken = environment.API_ACCESS_TOKEN || '';
  private accessToken = '';

  // Constructor method injecting HttpClient and CacheService
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // Method to get user information from GitHub API
  // Parameters:
  // - username: GitHub username of the user to fetch information for
  // Returns: Observable of type User containing user information

  getUser(username: string): Observable<User> {
    const cachedUser = this.cacheService.get(`user_${username}`); // Check if user information is cached
    if (cachedUser) {
      return of(cachedUser); // Return cached user information if available
    } else {
      let headers = {}; // Initialize headers object
      if (this.accessToken) { // If access token is provided, include it in headers
        headers = new HttpHeaders({
          Authorization: `token ${this.accessToken}`
        });
      }
      // Make HTTP GET request to fetch user information from GitHub API
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
  
  // Method to get repositories for a user from GitHub API
  // Parameters:
  // - username: GitHub username of the user whose repositories are to be fetched
  // - page: Page number for paginated results
  // - perPage: Number of repositories per page
  // Returns: Observable of type Repository[] containing user repositories

  getRepositories(username: string, page: number, perPage: number): Observable<Repository[]> {
    const cacheKey = `repos_${username}_page_${page}_perPage_${perPage}`; // Generate cache key for storing repositories
    const cachedRepos = this.cacheService.get(cacheKey); // Check if repositories are cached
    if (cachedRepos) {
      return of(cachedRepos); // Return cached repositories if available
    } else {
      let headers = {}; // Initialize headers object
      if (this.accessToken) { // If access token is provided, include it in headers
        headers = new HttpHeaders({
          Authorization: `token ${this.accessToken}`
        });
      }
      // Make HTTP GET request to fetch repositories from GitHub API
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
