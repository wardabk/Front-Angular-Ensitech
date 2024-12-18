import { Component, OnInit } from '@angular/core';
import { EtudiantService } from './etudiant.service';
import { Etudiant } from './etudiant.interface';
import { EtudiantModel } from './etudiant.model';
import * as bootstrap from 'bootstrap';
import { CoursService } from '../cours/cours.service';
import { Cours } from '../cours/cours.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css'],
})
export class EtudiantComponent implements OnInit {
  students: Etudiant[] = [];
  cours: Cours[] = [];
  filteredStudents: Etudiant[] = [];
  searchInput: string = '';
  newStudent: EtudiantModel = new EtudiantModel({
    id: null,
    nom: '',
    prenom: '',
    telephone: '',
    dateNaissance: new Date(),
    adresse: '',
  });
  selectedStudent: any | null = null;
  courList: any;
  selectedCourse: any = '';
  retrievedCourse: any = null;

  constructor(
    private etudiantService: EtudiantService,
    private coursService: CoursService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.coursService.getAllCours().subscribe((data: any) => {
      this.courList = data;
    });
  }



  // changeCours(): void {
  //   if (this.selectedCourse) {
  //     console.log('Cours sélectionné:', this.selectedCourse);
  //     const coursEtudiant = this.students.map((i) => {
  //       let test = i;
  //       console.log("id", i.id, this.selectedStudent?.id)
  //       if (i.id === this.selectedStudent?.id) {
  //         test = { ...i, ...{ course: this.selectedCourse } };
  //       }
  //       return test;
  //       console.log("Contenu Test cours",test)
  //     });
  //     console.log("Test cours",coursEtudiant)
  //   } else {
  //     console.log('Aucun cours sélectionné.');
  //   }
  // }
  // getCourseById(id: number): Cours | undefined {
  //   return this.courList?.find((cours: { coursID: number; }) => cours.coursID === id);
  // }

  changeCours(): void {
    if (!this.selectedStudent) {
      console.error('Aucun étudiant sélectionné.');
      return;
    }
  
    if (this.selectedCourse) {
      console.log('Cours sélectionné:', this.selectedCourse);
  
      // Créer l'objet à envoyer au backend
      const updatedStudent = {
        ...this.selectedStudent,
        theme: this.selectedCourse.theme, // Mettre à jour le champ 'theme'
      };
  
      // Envoyer les données au backend
      this.etudiantService.associateCourse(updatedStudent).subscribe({
        next: (response) => {
          console.log('Association sauvegardée dans la base de données :', response);
  
          // Mettre à jour localement la liste des étudiants
          const index = this.students.findIndex(
            (student) => student.id === this.selectedStudent?.id
          );
          if (index !== -1) {
            this.students[index] = updatedStudent;
          }
  
          // Mettre à jour l'étudiant affiché dans le modal des détails
          this.selectedStudent = updatedStudent;
        },
        error: (err) => {
          console.error('Erreur lors de l\'enregistrement de l\'association :', err);
        },
      });
    } else {
      console.log('Aucun cours sélectionné.');
    }
  }

  // savedCourse() {
  //   const savedData = this.selectedCourse; // Données à sauvegarder
  //   if (savedData) {
  //     localStorage.setItem("savedCourse", JSON.stringify(savedData)); // Sauvegarde avec une clé
  //     console.log("SavedData:", savedData);
  //   } else {
  //     console.log("Aucune donnée à sauvegarder.");
  //   }
  // }

  savedCourse() {
    if (!this.selectedStudent || !this.selectedCourse) {
      console.log('Étudiant ou cours non sélectionné.');
      return;
    }
  
    // Créer une copie de l'étudiant sélectionné avec le cours associé
    const updatedStudent = {
      ...this.selectedStudent,
      theme: this.selectedCourse.theme,
    };
  
    // Sauvegarder uniquement l'étudiant concerné dans le localStorage
    localStorage.setItem(
      `student_${this.selectedStudent.id}`,
      JSON.stringify(updatedStudent)
    );
  
    console.log('Cours associé pour l\'étudiant :', updatedStudent);
  }
  
  
  // loadSavedCourse() {
  //   const savedData = localStorage.getItem("savedCourse");
  //   if (savedData) {
  //     this.retrievedCourse = JSON.parse(savedData); // Charger les données dans une variable
  //     console.log("Données récupérées :", this.retrievedCourse);
  //   } else {
  //     console.log("Aucune donnée sauvegardée trouvée.");
  //   }
  // }

  loadSavedCourseForStudent() {
    if (!this.selectedStudent) return;
  
    const savedData = localStorage.getItem(`student_${this.selectedStudent.id}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.selectedStudent = { ...this.selectedStudent, ...parsedData }; // Met à jour l'étudiant avec les données sauvegardées
      console.log('Données récupérées pour l\'étudiant :', this.selectedStudent);
    } else {
      console.log('Aucune donnée sauvegardée pour cet étudiant.');
    }
  }

  viewDetails(student: Etudiant): void {
    this.selectedStudent = student; // Sélectionne l'étudiant
    this.loadSavedCourseForStudent(); // Charge les données sauvegardées pour cet étudiant
  }
  
  

  loadStudents(): void {
    this.etudiantService.getAll().subscribe({
      next: (students) => {
        this.students = students.map((student) =>
          EtudiantModel.fromJSON(student as any)
        );
        this.filteredStudents = this.students;
      },
      error: (err) => console.error('Error loading students', err),
    });
  }

  onSearch(): void {
    if (this.searchInput) {
      this.filteredStudents = this.students.filter(
        (student) =>
          student.nom.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          student.prenom.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      this.filteredStudents = this.students;
    }
  }

  addStudent(): void {
    if (
      this.newStudent.nom &&
      this.newStudent.prenom &&
      this.newStudent.telephone &&
      this.newStudent.adresse
    ) {
      this.etudiantService.add(this.newStudent).subscribe({
        next: (student) => {
          this.students.push(EtudiantModel.fromJSON(student as any));
          this.resetNewStudent();
          this.loadStudents(); // Rafraîchir la liste après l'ajout
        },
        error: (err) => console.error('Error adding student', err),
      });
    }
  }


  deleteStudent(student?: Etudiant): void {
    if (student && student.id !== null) {
      this.etudiantService.delete(student.id).subscribe({
        next: () => {
          console.log('Student deleted');
          this.loadStudents(); // Rafraîchir la liste après la suppression
          this.resetDetails(); // Réinitialiser les détails affichés
        },
        error: (err) => console.error('Error deleting student', err),
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
    this.etudiantService
      .update(this.newStudent.id!, this.newStudent)
      .subscribe({
        next: () => {
          console.log('Étudiant mis à jour avec succès.');
          this.loadStudents();
          this.closeModal();
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err),
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
    if (modal) {
      modal.hide(); // Ferme le modal
      modalElement?.setAttribute('aria-hidden', 'false'); // Assure que aria-hidden est réinitialisé
    }
  }

  private resetDetails(): void {
    this.selectedStudent = null;
  }

  private resetNewStudent(): void {
    this.newStudent = new EtudiantModel({
      id: null,
      nom: '',
      prenom: '',
      telephone: '',
      dateNaissance: new Date(),
      adresse: '',
    });
  }

  closeDetailsModal(): void {
    const modalElement = document.getElementById('detailsModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal?.hide();
  }

  openLinkModal(): void {
    const modalElement = document.getElementById('linkModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  openLinkModalWithDetails(student: Etudiant): void {
    this.viewDetails(student); // Définit l'étudiant sélectionné
    this.openLinkModal(); // Ouvre le modal
  }
}
