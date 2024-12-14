import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { User } from '../user';


@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  private apiUrl = 'http://localhost:3000/etudiant';

  constructor(private http: HttpClient) { }

  getAllEtudiant(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  deleteEtudiant(id: string): Observable<boolean> {
    const apiUrl = `http://localhost:3000/etudiant/${id}`;
    return this.http.delete(apiUrl).pipe(
      map(() => {
        console.log(`Etudiante with id ${id} deleted successfully.`);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting etudiante', error);
        return of(false); // Wrap the value in an observable
      })
    );
  }
  addEtudiant(etudiant: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, etudiant);
  }
  editEtudiant(etudiant: User): Observable<User> {
    // const id = Number(etudiant.id);
    return this.http.put<User>(`${this.apiUrl}/${etudiant.id}`, etudiant);
  }
}
