import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { EnseignantComponent } from './enseignant/enseignant.component';
import { CoursComponent } from './cours/cours.component';
import { NoteComponent } from './note/note.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
     EtudiantComponent,
    EnseignantComponent,
    CoursComponent,
    NoteComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
