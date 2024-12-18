import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from './etudiant.interface';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = 'http://localhost:3000/etudiant'; // Ajustez l'URL selon votre backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.baseUrl}`);
  }

  add(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(`${this.baseUrl}`, etudiant);
  }

  delete(id: number): Observable<void> { // Méthode pour supprimer un étudiant
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, etudiant: Etudiant): Observable<Etudiant> { // Méthode pour mettre à jour un étudiant
    return this.http.put<Etudiant>(`${this.baseUrl}/${id}`, etudiant);
  }

  associateCourse(student: Etudiant): Observable<any> {
    const url = `${this.baseUrl}/${student.id}`;
    return this.http.put(url, student);
  }
  
  
}
