//RepositoryList.component.ts
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { Repository } from '../../models/repository.model';

@Component({
  selector: 'app-repository-list',
  templateUrl: './RepositoryList.component.html'
})
export class RepositoryListComponent implements OnInit, OnChanges {
  @Input() username?: string; // Declare the username input property
  @Input() publicRepos: number=0;
  repositories: Repository[] = [];
  currentPage = 1;
  pageSize = 10; // Default page size
  pageSizeOptions = [10, 25, 50, 100]; // Page size options
  totalPages = 0; 
  
  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    
    // Fetch repositories for the provided username and default page size
    this.totalPages=Math.ceil(this.publicRepos / this.pageSize);
    if (this.username) {
      this.fetchRepositories(this.username, this.currentPage, this.pageSize);
    }
  }

  

  ngOnChanges(changes: SimpleChanges): void {
    
    console.log(this.totalPages);
    this.totalPages=Math.ceil(this.publicRepos / this.pageSize);
    if (changes['username'] && !changes['username'].firstChange) {
      this.currentPage = 1; // Reset current page when username changes
      if (this.username) {
        this.fetchRepositories(this.username, this.currentPage, this.pageSize);
      }
    }
  }
  
  loading=false;
  fetchRepositories(username: string, page: number, perPage: number): void {
    this.loading = true;
    this.githubService.getRepositories(username, page, perPage).subscribe(repos => {
      this.repositories = repos;
      this.loading = false; 
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.username) {
      this.fetchRepositories(this.username, this.currentPage, this.pageSize);
    }
  }

  onPageSizeChange(event: Event): void {
    
    const target = event.target as HTMLSelectElement;
    this.pageSize = parseInt(target.value, 10);
    this.currentPage = 1; // Reset current page when page size changes
    const selectedPageSize = parseInt(target.value, 10);
    this.totalPages = Math.ceil(this.publicRepos / selectedPageSize);
    console.log('Selected page size:', selectedPageSize);
   
    if (this.username) {
      this.fetchRepositories(this.username, this.currentPage, this.pageSize);
    }
    
  }
}
