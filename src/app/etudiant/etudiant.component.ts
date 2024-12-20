import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';
import { EtudiantService } from './etudiant.service';
import { Cours } from '../cours/cours.interface';
import { CoursService } from '../cours/cours.service';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit, AfterViewInit {
  listEtudiant: any[] = [];
  filteredEtudiant: any[] = [];
  searchInput: string = '';
  successMsg: string = '';
  errorMsg: string = '';
  etudiant: any = {
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
  constructor(private etudiantService: EtudiantService, private coursService: CoursService) { }
  isEtudiantInitialized(): boolean {
    return this.etudiant.nom === '';
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
    this.etudiantService.getAllEtudiant().subscribe((data) => {
      const result = data.map((i) => {
        let item = i
        if (!i.cours) {
          item = { ...i, ...{ cours: [] } }
        }
        return item
      })
      console.log("za", result)
      this.listEtudiant = result;
      this.filteredEtudiant = result;
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
    // const modalElement = document.getElementById('etudiantFormContainer');
    const modalTitle = document.getElementById('modal-title');
    const formElement = document.getElementById('etudiantForm') as HTMLFormElement;
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');


    if (this.modalElement && modalTitle && formElement && saveButton && editButton) {
      saveButton.style.display = 'none';
      editButton.style.display = 'none';
      this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {

        if (this.isEtudiantInitialized()) {
          modalTitle.innerHTML = 'Ajouter un Etudiant';
          saveButton.style.display = 'block';
        } else {
          modalTitle.innerHTML = 'Modifier Etudiant';
          editButton.style.display = 'block';
        }
      });

      this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
        modalTitle.innerHTML = '';
        formElement.reset();
        this.etudiant = {
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
  openModal(etudiant: any): void {
    // const modalElement = document.getElementById('etudiantFormContainer');
    if (this.modalElement) {
      this.etudiant = { ...etudiant }
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

    if (!this.isEtudiantInitialized()) {
      const lastId = Math.max(...this.listEtudiant.map(i => Number(i.id)));
      const newEtudiant = { ...this.etudiant, ...{ id: `${lastId + 1}` } }
      // const newEtudiant = { ...this.etudiant, ...{ id: lastId + 1 } }
      this.etudiantService.addEtudiant(newEtudiant).subscribe({
        next: (resp) => {
          console.log('Etudiant saved:', resp);

          this.closeModal()
          this.onfetchData()
          this.handleAlert("success", 'Etudiant enregistré avec succès');

        },
        error: (err) => console.error('Error saving etudiante:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    }


  }
  onEdit(): void {
    // const modalElement = document.getElementById('etudiantFormContainer');
    if (!this.isEtudiantInitialized()) {
      this.etudiantService.editEtudiant(this.etudiant).subscribe({
        next: (resp) => {
          console.log('Etudiant edit:', resp);
          this.closeModal()
          this.onfetchData()
          this.handleAlert("success", 'Etudiant modifié avec succès');

        },
        error: (err) => console.error('Error editing etudiant:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    }

  }
  onDelete(id: string): void {
    this.etudiantService.deleteEtudiant(id).subscribe((isDeleted) => {
      if (isDeleted) {
        // this.listEtudiant = this.listEtudiant.filter(etudiant => etudiant.id !== id);
        this.onfetchData()
        this.handleAlert("success", 'Etudiant supprimé avec succès');

      } else {
        console.error(`Failed to delete etudiante with id ${id}`);
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
      this.filteredEtudiant = this.listEtudiant.filter((etudiant) =>
        this.normalizeText(etudiant?.nom).includes(normalizedSearchTerm) ||
        this.normalizeText(etudiant?.prenom).includes(normalizedSearchTerm) ||
        this.normalizeText(etudiant?.telephone).includes(normalizedSearchTerm)
      );

      if (this.filteredEtudiant.length === 0) {
        console.error('Aucun résultat');
        this.handleAlert("error", 'Aucun résultat');
      }
    } else {
      this.filteredEtudiant = [...this.listEtudiant];
    }
  }
  onSelectCours(cours: Cours, event: any): void {
    if (event.target.checked) {
      // Add the item to selectedItems if checked
      this.etudiant.cours.push(cours);
    } else {

      // Remove the item from selectedItems if unchecked
      const index = this.etudiant.cours.findIndex((i: any) => i.id === cours.id);
      console.log("ddd", index)
      if (index !== -1) {
        this.etudiant.cours.splice(index, 1);
      }
    }

    // console.log("aaaa", this.etudiant)
  }

  isSelected(cours: Cours): boolean {
    return this.etudiant.cours.some((selectedCours: any) => selectedCours.id === cours.id);
  }
  // get associatedCours(): string {
  //   return this.etudiant.cours?.map((i: any) => i.theme).join(', ') || '';
  // }

}
