import { Component, OnInit } from '@angular/core';
import { EtudiantService } from './etudiant.service';
import { Etudiant } from './etudiant.interface';
import { EtudiantModel } from './etudiant.model';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit {
  students: Etudiant[] = [];
  filteredStudents: Etudiant[] = [];
  searchInput: string = '';
  newStudent: EtudiantModel = new EtudiantModel({ id: null, nom: '', prenom: '', telephone: '', dateNaissance: new Date(), adresse: '' });
  selectedStudent: Etudiant | null = null;

  constructor(private etudiantService: EtudiantService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.etudiantService.getAll().subscribe({
      next: students => {
        this.students = students.map(student => EtudiantModel.fromJSON(student as any));
        this.filteredStudents = this.students;
      },
      error: err => console.error('Error loading students', err)
    });
  }

  onSearch(): void {
    if (this.searchInput) {
      this.filteredStudents = this.students.filter(student =>
        student.nom.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        student.prenom.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      this.filteredStudents = this.students;
    }
  }

  addStudent(): void {
    if (this.newStudent.nom && this.newStudent.prenom && this.newStudent.telephone && this.newStudent.adresse) {
      this.etudiantService.add(this.newStudent).subscribe({
        next: student => {
          this.students.push(EtudiantModel.fromJSON(student as any)); // Ajouter le nouvel étudiant à la liste
          this.resetNewStudent();
        },
        error: err => console.error('Error adding student', err)
      });
    }
  }

  viewDetails(student: Etudiant): void {
    this.selectedStudent = student;
    // Suppression du modal, utilisation d'une autre méthode comme un composant de détails ou une autre approche pour afficher les informations
  }

  private resetNewStudent(): void {
    this.newStudent = new EtudiantModel({ id: null, nom: '', prenom: '', telephone: '', dateNaissance: new Date(), adresse: '' });
  }
}
