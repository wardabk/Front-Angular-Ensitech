import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { User } from '../user';



@Injectable({
  providedIn: 'root',
})
export class EnseignantService {
  private apiUrl = 'http://localhost:3000/enseignant';

  constructor(private http: HttpClient) { }

  getAllEnseignant(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteEnseignant(id: string): Observable<boolean> {
    const apiUrl = `http://localhost:3000/enseignant/${id}`;
    return this.http.delete(apiUrl).pipe(
      map(() => {
        console.log(`Enseignante with id ${id} deleted successfully.`);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting enseignante', error);
        return of(false); // Wrap the value in an observable
      })
    );
  }
  addEnseignant(enseignant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, enseignant);
  }
  editEnseignant(enseignant: any): Observable<any> {
    // const id = Number(enseignant.id);
    return this.http.put<any>(`${this.apiUrl}/${enseignant.id}`, enseignant);
  }
}
