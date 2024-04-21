// UserProfile.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './UserProfile.component';
import { GithubService } from '../../services/github.service';
import { HttpClientModule } from '@angular/common/http';
import { SkeletonLoaderComponent } from '../SkeletonLoader/SkeletonLoader.component'; 


describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let githubService: GithubService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [UserProfileComponent, SkeletonLoaderComponent],
      providers: [GithubService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
