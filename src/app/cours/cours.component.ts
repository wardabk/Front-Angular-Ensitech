import { Component, OnInit } from '@angular/core';
import { Cours } from './cours.interface';
import { CoursService } from './cours.service';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  listCours: Cours[] = [];
  filteredCours: Cours[] = [];
  searchInput: string = '';
  constructor(private coursService: CoursService) { }
  onGetData(): void {
    this.coursService.getAllCours().subscribe((data) => {
      this.listCours = data;
      this.filteredCours =  data;
    });
  }
  ngOnInit(): void {
    this.onGetData()
  }
  onEditCours(cours: Cours): void {
    console.log("editCours", cours)
  }
  onDeleteCours(id: number): void {
    this.coursService.deleteCours(id).subscribe((isDeleted) => {
      if (isDeleted) {
        // this.listCours = this.listCours.filter(cours => cours.id !== id);
        this.onGetData()

      } else {
        console.error(`Failed to delete course with id ${id}`);
      }
    });
  }

  onSearch(): void {
    const normalizedSearchTerm = this.searchInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (normalizedSearchTerm) {
      this.filteredCours = this.listCours.filter((cours) =>
        cours?.theme
          ?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(normalizedSearchTerm) ||
        cours?.nbreHeure.toString().includes(normalizedSearchTerm)
      );

      if (this.filteredCours.length === 0) {
        console.error('Aucun résultat');
      }
    } else {
      this.filteredCours = [...this.listCours];
    }
  }
}
