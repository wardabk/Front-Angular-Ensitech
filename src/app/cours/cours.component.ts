import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { Cours } from './cours.interface';
import { CoursService } from './cours.service';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css'],
})
export class CoursComponent implements OnInit, AfterViewInit {
  listCours: Cours[] = [];
  filteredCours: Cours[] = [];
  searchInput: string = '';
  successMsg: string = '';
  errorMsg: string = '';
  cours: Cours = {
    id: '',
    theme: '',
    nbreHeure: 0,
  };

  @ViewChild('coursFormContainer', { static: true }) modalElement!: ElementRef;
  modalInstance!: Modal;
  constructor(private coursService: CoursService) {}
  isCoursInitialized(): boolean {
    return this.cours.theme === '' || this.cours.nbreHeure === 0;
  }
  handleAlert(type: string, msg: string): void {
    if (type === 'success') {
      this.successMsg = msg;
    } else if (type === 'error') {
      this.errorMsg = msg;
    }

    setTimeout(() => {
      this.errorMsg = '';
      this.successMsg = '';
    }, 2000);
  }
  onfetchData(): void {
    this.coursService.getAllCours().subscribe((data) => {
      this.listCours = data;
      this.filteredCours = data;
    });
  }
  ngOnInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.onfetchData();
  }
  ngAfterViewInit() {
    // const modalElement = document.getElementById('coursFormContainer');
    const modalTitle = document.getElementById('modal-title');
    const formElement = document.getElementById('coursForm') as HTMLFormElement;
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');

    if (
      this.modalElement &&
      modalTitle &&
      formElement &&
      saveButton &&
      editButton
    ) {
      saveButton.style.display = 'none';
      editButton.style.display = 'none';
      this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {
        if (this.isCoursInitialized()) {
          modalTitle.innerHTML = 'Nouveau Cours';
          saveButton.style.display = 'block';
        } else {
          modalTitle.innerHTML = 'Informations du Cours';
          editButton.style.display = 'block';
        }
      });

      this.modalElement.nativeElement.addEventListener(
        'hidden.bs.modal',
        () => {
          modalTitle.innerHTML = '';
          formElement.reset();
          this.cours = {
            id: '',
            theme: '',
            nbreHeure: 0,
          };
          saveButton.style.display = 'none';
          editButton.style.display = 'none';
        }
      );
    }
  }
  openModal(cours: Cours): void {
    // const modalElement = document.getElementById('coursFormContainer');
    if (this.modalElement) {
      this.cours = { ...cours };
      // const modal = new Modal(modalElement);
      this.modalInstance.show();
    }
  }
  onSave(): void {
    if (!this.isCoursInitialized()) {
      const lastId = Math.max(...this.listCours.map((i) => Number(i.id)));
      const newCours = { ...this.cours, ...{ id: `${lastId + 1}` } };
      // const newCours = { ...this.cours, ...{ id: lastId + 1 } }
      this.coursService.addCours(newCours).subscribe({
        next: (resp) => {
          console.log('Cours saved:', resp);

          if (this.modalElement) {
            this.modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            console.log('Modal hide called');
          } else {
            console.error('Modal element not found');
          }
          this.onfetchData();
          this.handleAlert('success', 'Cours enregistré avec succès');
        },
        error: (err) => console.error('Error saving course:', err),
      });
    } else {
      this.handleAlert('error', 'Veuillez remplir tous les champs');
    }
  }
  onEdit(): void {
    // const modalElement = document.getElementById('coursFormContainer');
    if (!this.isCoursInitialized()) {
      this.coursService.editCours(this.cours).subscribe({
        next: (resp) => {
          console.log('Cours edit:', resp);
          if (this.modalElement) {
            this.modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            console.log('Modal hide called');
          } else {
            console.error('Modal element not found');
          }
          this.onfetchData();
          this.handleAlert('success', 'Cours modifié avec succès');
        },
        error: (err) => console.error('Error editing cours:', err),
      });
    } else {
      this.handleAlert('error', 'Veuillez remplir tous les champs');
    }
  }
  onDelete(id: string): void {
    this.coursService.deleteCours(id).subscribe((isDeleted) => {
      if (isDeleted) {
        // this.listCours = this.listCours.filter(cours => cours.id !== id);
        this.onfetchData();
        this.handleAlert('success', 'Cours supprimé avec succès');
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
      this.filteredCours = this.listCours.filter(
        (cours) =>
          cours?.theme
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalizedSearchTerm) ||
          cours?.nbreHeure.toString().includes(normalizedSearchTerm)
      );

      if (this.filteredCours.length === 0) {
        console.error('Aucun résultat');
        this.handleAlert('error', 'Aucun résultat');
      }
    } else {
      this.filteredCours = [...this.listCours];
    }
  }
}
