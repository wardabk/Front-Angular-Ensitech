import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Cours } from './cours.interface';


@Injectable({
  providedIn: 'root',
})
export class CoursService {
  private apiUrl = 'http://localhost:3000/cours'; 

  constructor(private http: HttpClient) {}

  getAllCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl);
  }
  deleteCours(id: number): Observable<boolean> {
    const apiUrl = `http://localhost:3000/cours/${id}`;
    return this.http.delete(apiUrl).pipe(
      map(() => {
        console.log(`Course with id ${id} deleted successfully.`);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting course', error);
        return of(false); // Wrap the value in an observable
      })
    );
  }
  addCours(cours: Cours): Observable<Cours> {
    return this.http.post<Cours>(this.apiUrl, cours);
  }
}
