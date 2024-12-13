import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Note } from './note.interface';
import { User } from './../user';
import { Cours } from '../cours/cours.interface';


@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:3000/note';

  constructor(private http: HttpClient) { }

  getAllNote(): Observable<Note[]> {
    return new Observable((observer) => {
      Promise.all([
        fetch('http://localhost:3000/note').then(res => res.json()),
        fetch('http://localhost:3000/etudiant').then(res => res.json()),
        fetch('http://localhost:3000/enseignant').then(res => res.json()),
        fetch('http://localhost:3000/cours').then(res => res.json())
      ])
        .then(([listNote, listEtudiant, listEnseignant, listCours]) => {
          const result = listNote.map((note: Note) => {
            const etudiant = listEtudiant.find((i: User) => i.id === note.idEtudiant);
            const enseignant = listEnseignant.find((i: User) => i.id === note.idEnseignant);
            const cours = listCours.find((i: Cours) => i.id === note.idCours);
            return {
              ...note,
              nomEtudiant: etudiant ? `${etudiant.prenom ?? ''} ${etudiant.nom ?? ''}` : 'Introuvable',
              nomEnseignant: enseignant ? `${enseignant.prenom ?? ''} ${enseignant.nom ?? ''}` : 'Introuvable',
              themeCours: cours ? `${cours.theme ?? ''}` : 'Introuvable',

            };
          });
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
  deleteNote(id: string): Observable<boolean> {
    const apiUrl = `http://localhost:3000/note/${id}`;
    return this.http.delete(apiUrl).pipe(
      map(() => {
        console.log(`notee with id ${id} deleted successfully.`);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting notee', error);
        return of(false); // Wrap the value in an observable
      })
    );
  }
  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }
  editNote(note: Note): Observable<Note> {
    // const id = Number(note.id);
    return this.http.put<Note>(`${this.apiUrl}/${note.id}`, note);
  }
}
