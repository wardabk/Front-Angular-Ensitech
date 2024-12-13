import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { CreateStudentComponent } from './etudiant/create-student/create-student.component';
import { EditStudentComponent } from './etudiant/edit-student/edit-student.component';

const routes: Routes = [
  // Liste des étudiants
  { path: 'student', component: EtudiantComponent },

  // Création d'un étudiant
  { path: 'student/create', component: CreateStudentComponent },

  // Édition d'un étudiant
  { path: 'student/edit/:id', component: EditStudentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
