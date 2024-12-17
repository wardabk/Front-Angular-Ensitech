import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard'
import { CoursComponent } from './cours/cours.component';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { EnseignantComponent } from './enseignant/enseignant.component';
import { NoteComponent } from './note/note.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'etudiants', component: EtudiantComponent, canActivate: [AuthGuard] },
  { path: 'enseignants', component: EnseignantComponent, canActivate: [AuthGuard] },
  { path: 'cours', component: CoursComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NoteComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'signin' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
