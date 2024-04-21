//UserProfile.component.ts

import { Component, OnInit,Input } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './UserProfile.component.html'
})

export class UserProfileComponent implements OnInit {
  @Input() user: User | null = null; 

  constructor(private githubService: GithubService) {}


  ngOnInit(): void {}
}
