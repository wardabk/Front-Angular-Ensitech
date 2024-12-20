import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';
import { EnseignantService } from './enseignant.service';
import { Cours } from '../cours/cours.interface';
import { CoursService } from '../cours/cours.service';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.css']
})
export class EnseignantComponent implements OnInit, AfterViewInit {
  listEnseignant: any[] = [];
  filteredEnseignant: any[] = [];
  searchInput: string = '';
  successMsg: string = '';
  errorMsg: string = '';
  enseignant: any = {
    id: "",
    nom: "",
    prenom: "",
    fonction: '',
    email: '',
    adresse: '',
    password: '',
    telephone: '',
    dateNaissance: '',
    cours: [],
  };

  listCours: Cours[] = [];
  selectedCours: Cours[] = [];
  // options = ['apple', 'banana', 'cherry', 'date', 'elderberry'];


  @ViewChild('formContainer', { static: true }) modalElement!: ElementRef;
  modalInstance!: Modal
  constructor(private enseignantService: EnseignantService, private coursService: CoursService) { }
  isEnseignantInitialized(): boolean {
    return this.enseignant.nom === '';
  }
  handleAlert(type: string, msg: string): void {
    if (type === "success") {
      this.successMsg = msg
    } else if (type === "error") {
      this.errorMsg = msg
    }

    setTimeout(() => {
      this.errorMsg = ''
      this.successMsg = ''
    }
      , 2000)
  }
  onfetchData(): void {
    this.enseignantService.getAllEnseignant().subscribe((data) => {
      const result = data.map((i) => {
        let item = i
        if (!i.cours) {
          item = { ...i, ...{ cours: [] } }
        }
        return item
      })
      console.log("za", result)
      this.listEnseignant = result;
      this.filteredEnseignant = result;
    });
    this.coursService.getAllCours().subscribe((data) => {
      this.listCours = data;
    });
  }
  ngOnInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.onfetchData()
  }
  ngAfterViewInit() {
    // const modalElement = document.getElementById('enseignantFormContainer');
    const modalTitle = document.getElementById('modal-title');
    const formElement = document.getElementById('enseignantForm') as HTMLFormElement;
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');


    if (this.modalElement && modalTitle && formElement && saveButton && editButton) {
      saveButton.style.display = 'none';
      editButton.style.display = 'none';
      this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {

        if (this.isEnseignantInitialized()) {
          modalTitle.innerHTML = 'Ajouter un Enseignant';
          saveButton.style.display = 'block';
        } else {
          modalTitle.innerHTML = 'Modifier Enseignant';
          editButton.style.display = 'block';
        }
      });

      this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
        modalTitle.innerHTML = '';
        formElement.reset();
        this.enseignant = {
          id: "",
          nom: "",
          prenom: "",
          fonction: '',
          email: '',
          adresse: '',
          password: '',
          telephone: '',
          dateNaissance: '',
          cours: [],
        }
        saveButton.style.display = 'none';
        editButton.style.display = 'none';
      });
    }
  }
  openModal(enseignant: any): void {
    // const modalElement = document.getElementById('enseignantFormContainer');
    if (this.modalElement) {
      this.enseignant = { ...enseignant }
      // const modal = new Modal(modalElement);
      this.modalInstance.show();
    }
  }
  closeModal(): void {
    if (this.modalElement) {

      this.modalInstance.hide();
      /*const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      console.log('Modal hide called'); */
    } else {
      console.error('Modal element not found');
    }
  }
  onSave(): void {

    if (!this.isEnseignantInitialized()) {
      const lastId = Math.max(...this.listEnseignant.map(i => Number(i.id)));
      const newEnseignant = { ...this.enseignant, ...{ id: `${lastId + 1}` } }
      // const newEnseignant = { ...this.enseignant, ...{ id: lastId + 1 } }
      this.enseignantService.addEnseignant(newEnseignant).subscribe({
        next: (resp) => {
          console.log('Enseignant saved:', resp);

          this.closeModal()
          this.onfetchData()
          this.handleAlert("success", 'Enseignant enregistré avec succès');

        },
        error: (err) => console.error('Error saving enseignante:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    }


  }
  onEdit(): void {
    // const modalElement = document.getElementById('enseignantFormContainer');
    if (!this.isEnseignantInitialized()) {
      this.enseignantService.editEnseignant(this.enseignant).subscribe({
        next: (resp) => {
          console.log('Enseignant edit:', resp);
          this.closeModal()
          this.onfetchData()
          this.handleAlert("success", 'Enseignant modifié avec succès');

        },
        error: (err) => console.error('Error editing enseignant:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    }

  }
  onDelete(id: string): void {
    this.enseignantService.deleteEnseignant(id).subscribe((isDeleted) => {
      if (isDeleted) {
        // this.listEnseignant = this.listEnseignant.filter(enseignant => enseignant.id !== id);
        this.onfetchData()
        this.handleAlert("success", 'Enseignant supprimé avec succès');

      } else {
        console.error(`Failed to delete enseignante with id ${id}`);
      }
    });
  }
  normalizeText(text: string): string {
    return text
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase() || ""
  };
  onSearch(): void {
    const normalizedSearchTerm = this.searchInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (normalizedSearchTerm) {
      this.filteredEnseignant = this.listEnseignant.filter((enseignant) =>
        this.normalizeText(enseignant?.nom).includes(normalizedSearchTerm) ||
        this.normalizeText(enseignant?.prenom).includes(normalizedSearchTerm) ||
        this.normalizeText(enseignant?.telephone).includes(normalizedSearchTerm)
      );

      if (this.filteredEnseignant.length === 0) {
        console.error('Aucun résultat');
        this.handleAlert("error", 'Aucun résultat');
      }
    } else {
      this.filteredEnseignant = [...this.listEnseignant];
    }
  }
  onSelectCours(cours: Cours, event: any): void {
    if (event.target.checked) {
      // Add the item to selectedItems if checked
      this.enseignant.cours.push(cours);
    } else {

      // Remove the item from selectedItems if unchecked
      const index = this.enseignant.cours.findIndex((i: any) => i.id === cours.id);
      console.log("ddd", index)
      if (index !== -1) {
        this.enseignant.cours.splice(index, 1);
      }
    }

    // console.log("aaaa", this.enseignant)
  }

  isSelected(cours: Cours): boolean {
    return this.enseignant.cours.some((selectedCours: any) => selectedCours.id === cours.id);
  }
  // get associatedCours(): string {
  //   return this.enseignant.cours?.map((i: any) => i.theme).join(', ') || '';
  // }

}
