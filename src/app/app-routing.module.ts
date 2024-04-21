import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/UserProfile/UserProfile.component';
import { RepositoryListComponent } from './components/RepositoryList/RepositoryList.component';

const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'profile', component: UserProfileComponent },
  { path: 'repositories', component: RepositoryListComponent }
  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
