// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<{users: any[]}>('assets/data/db.json');
  }

  getEtudiants() {
    return this.http.get<{etudiant: any[]}>('assets/data/db.json');
  }

  getEnseignants() {
    return this.http.get<{enseignant: any[]}>('assets/data/db.json');
  }

  getCours() {
    return this.http.get<{cours: any[]}>('assets/data/db.json');
  }

  getNotes() {
    return this.http.get<{note: any[]}>('assets/data/db.json');
  }

  getDashboardStats() {
    return forkJoin({
      users: this.getUsers(),
      etudiants: this.getEtudiants(),
      enseignants: this.getEnseignants(),
      cours: this.getCours(),
      notes: this.getNotes()
    });
  }
}
