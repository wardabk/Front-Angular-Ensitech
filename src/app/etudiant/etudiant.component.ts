import { Component, OnInit } from '@angular/core';
import { EtudiantService } from './etudiant.service';
import { Etudiant } from './etudiant.interface';
import { EtudiantModel } from './etudiant.model';
import * as bootstrap from 'bootstrap';


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
          this.students.push(EtudiantModel.fromJSON(student as any));
          this.resetNewStudent();
          this.loadStudents(); // Rafraîchir la liste après l'ajout
        },
        error: err => console.error('Error adding student', err)
      });
    }
  }

  viewDetails(student: Etudiant): void {
    this.selectedStudent = student;
  }

  deleteStudent(student?: Etudiant): void {
    if (student && student.id !== null) {
      this.etudiantService.delete(student.id).subscribe({
        next: () => {
          console.log('Student deleted');
          this.loadStudents(); // Rafraîchir la liste après la suppression
          this.resetDetails(); // Réinitialiser les détails affichés
        },
        error: (err) => console.error('Error deleting student', err)
      });
    }
    this.closeDetailsModal();
  }

  editStudent(student: Etudiant): void {
    this.newStudent = { ...student }; // Cloner l'étudiant pour éviter les mutations
    this.closeDetailsModal();
    this.openModal();
  }
  
  saveStudent(): void {
    if (this.newStudent.id) {
      this.updateStudent();
    } else {
      this.addStudent();
    }
  }
  
  updateStudent(): void {
    this.etudiantService.update(this.newStudent.id!, this.newStudent).subscribe({
      next: () => {
        console.log('Étudiant mis à jour avec succès.');
        this.loadStudents();
        this.closeModal();
      },
      error: err => console.error('Erreur lors de la mise à jour', err)
    });
  }
  
  openModal(): void {
    const modalElement = document.getElementById('studentFormContainer');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }
  
  closeModal(): void {
    const modalElement = document.getElementById('studentFormContainer');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal?.hide();
  }
  
  private resetDetails(): void {
    this.selectedStudent = null;
  }

  private resetNewStudent(): void {
    this.newStudent = new EtudiantModel({ id: null, nom: '', prenom: '', telephone: '', dateNaissance: new Date(), adresse: '' });
  }

  closeDetailsModal(): void {
    const modalElement = document.getElementById('detailsModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal?.hide();
  }
  

}