import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard'

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' }, // Default route
  { path: 'signin', component: SigninComponent }, // SignIn route
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },     // Home route
  { path: '**', redirectTo: 'signin' },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
