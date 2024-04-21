
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './components/app.component';
import { UserProfileComponent } from './components/UserProfile/UserProfile.component';
import { RepositoryListComponent } from './components/RepositoryList/RepositoryList.component';
import { SearchComponent } from './components/Search/Search.component';
import { PaginationComponent } from './components/Pagination/Pagination.component';
import { SkeletonLoaderComponent } from './components/SkeletonLoader/SkeletonLoader.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    RepositoryListComponent,
    SearchComponent,
    PaginationComponent,
    SkeletonLoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
