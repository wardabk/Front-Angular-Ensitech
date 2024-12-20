import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Etudiant } from './etudiant.interface';
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = 'http://localhost:3000/etudiant'; // Ajustez l'URL selon votre backend

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  add(etudiant: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, etudiant);
  }

  delete(id: number): Observable<void> { // Méthode pour supprimer un étudiant
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, etudiant: Etudiant): Observable<Etudiant> { // Méthode pour mettre à jour un étudiant
    return this.http.put<Etudiant>(`${this.baseUrl}/${id}`, etudiant);
  }
  getAllEtudiant(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
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
  addEtudiant(etudiant: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, etudiant);
  }
  editEtudiant(etudiant: any): Observable<any> {
    // const id = Number(etudiant.id);
    return this.http.put<any>(`${this.baseUrl}/${etudiant.id}`, etudiant);
  }
}
