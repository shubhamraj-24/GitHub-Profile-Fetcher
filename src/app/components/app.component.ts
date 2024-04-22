// app.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { GithubService } from '../services/github.service';
import { User } from '../models/user.model';
import { Repository } from '../models/repository.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements  OnDestroy {
  currentPage = 1;
  totalPages = 1;
  loading = false; // Flag indicating loading state
  user: User | null = null;
  repositories: Repository[] = [];
  username = ''; // Username input by the user
  public_repos: number = 0;
  userDataSubscription: Subscription | undefined; // Subscription for user data retrieval
  repositoryDataSubscription: Subscription | undefined; // Subscription for repository data retrieval


  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    // Load initial user data and repositories
    this.loadUserData('shubhamraj-24');
  }


  // Method to load user data from GitHub API
  loadUserData(username: string): void {
    this.loading = true;
    // Fetch user profile data
    this.userDataSubscription = this.githubService.getUser(username).subscribe({
      next: user => {
        this.user = user;
        // Fetch repository list data
        this.loadRepositories(username, this.currentPage);
        this.public_repos = user.public_repos;
      },
      error: error => {
        this.loading = false;
        console.error('Error fetching user data:', error);
        // Reset user data if not found
        this.user = null;
      }
    });
  }


  // Method to load repositories for a user from GitHub API
  loadRepositories(username: string, page: number): void {
    this.repositoryDataSubscription = this.githubService.getRepositories(username, page, 10).subscribe({
      next: repos => {
        this.repositories = repos;
        this.loading = false;
        // Update total pages based on the total count of repositories
        if (this.user && this.user.public_repos) {
          this.totalPages = Math.ceil(this.user.public_repos / 10);
        }
      },
      error: error => {
        this.loading = false;
        console.error('Error fetching repository data:', error);
      }
    });
  }


  // Method triggered when user performs a search
  onSearch(username: string): void {
    this.username = username;
    this.loadUserData(username);
  }


  // Method triggered when user changes the page
  onPageChange(page: number): void {
    this.currentPage = page;
    // Fetch repositories for the selected page
    this.loadRepositories(this.username, page);
  }


  // Lifecycle hook called when the component is destroyed
  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to prevent memory leaks
    this.userDataSubscription?.unsubscribe();
    this.repositoryDataSubscription?.unsubscribe();
  }
}