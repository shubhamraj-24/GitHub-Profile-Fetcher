// github.service.spec.ts

import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { GithubService } from './github.service';
import { CacheService } from './cache.service';
import { User } from '../models/user.model';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [GithubService, CacheService]
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user', () => {
    const dummyUser: User = {
      login: 'johnpapa',
      id: 1202528,
      avatar_url: 'https://avatars.githubusercontent.com/u/1202528?v=4',
      html_url: 'https://github.com/johnpapa',
      name: 'John Papa',
      bio: 'Winter is Coming',
      location: 'Orlando, FL',
      twitter_username: 'john_papa',
      public_repos: 145
    };

    service.getUser('johnpapa').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/johnpapa`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should handle error 404 when getting user', () => {
    service.getUser('nonexistentuser').subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/users/nonexistentuser`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should handle error 401 when getting user', () => {
    service.getUser('unauthorizeduser').subscribe(
      () => {},
      error => {
        expect(error.message).toBe('Invalid or missing access token');
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/users/unauthorizeduser`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle rate limit exceeded error when getting user', () => {
    service.getUser('rate-limited-user').subscribe(
      () => {},
      error => {
        expect(error.message).toBe('Rate limit exceeded. Please add a valid access token.');
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/users/rate-limited-user`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'API rate limit exceeded' }, { status: 403, statusText: 'Forbidden' });
  });

});
