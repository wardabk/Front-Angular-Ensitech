import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { CreateStudentComponent } from './etudiant/create-student/create-student.component';
import { DeleteStudentComponent } from './etudiant/delete-student/delete-student.component';
import { EditStudentComponent } from './etudiant/edit-student/edit-student.component';

const routes: Routes = [
  {path: 'student', component: EtudiantComponent},
  {path: 'student/create-student', component: CreateStudentComponent},
  {path: 'student/delete-student/:id', component: DeleteStudentComponent},
  {path: 'student/edit-student/:id', component: EditStudentComponent},
  {
    path: '**',
    redirectTo: 'student/create-student',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'student/delete-student/:id',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'student/edit-student/:id',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
