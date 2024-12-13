import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { EnseignantComponent } from './enseignant/enseignant.component';
import { CoursComponent } from './cours/cours.component';
import { NoteComponent } from './note/note.component';
import { HomeComponent } from './home/home.component';

import { ReactiveFormsModule } from '@angular/forms';
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
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
