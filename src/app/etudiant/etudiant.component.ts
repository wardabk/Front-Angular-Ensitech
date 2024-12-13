import { Component, OnInit } from '@angular/core';
import { StudentInterface } from '../student-interface';
import { StudentServiceService } from '../student-service.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css'],
})
export class EtudiantComponent implements OnInit {
  allStudent: StudentInterface[] = [];
  filteredStudents: StudentInterface[] = [];
  searchQuery: string = '';

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentService.getAll().subscribe((data) => {
      this.allStudent = data;
      this.filteredStudents = this.allStudent;
    });
  }

  deleteItem(id: number | undefined) {
    const validId = id ?? -1; // -1 comme valeur par défaut pour indiquer un ID invalide
    if (validId === -1) {
      console.error('ID invalide, suppression annulée.');
      return;
    }

    this.studentService.delete(validId).subscribe({
      next: () => {
        this.allStudent = this.allStudent.filter(
          (student) => student.id !== validId
        );
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
      },
    });
  }

  formdata: StudentInterface = {
    id: 0,
    firstName: '',
    lastName: '',
    tel: 0,
    address: '',
  };

  create() {
    this.studentService.create(this.formdata).subscribe({
      next: (data) => {
        console.log('Student created successfully:', data);
        this.router.navigate(['student']);
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  filterStudents(): void {
    const query = this.searchQuery.toLowerCase(); // Convertir la saisie en minuscules pour la recherche insensible à la casse
    this.filteredStudents = this.allStudent.filter((student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(query)
    );
  }
}
