import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';
import { User } from '../user';
import { EtudiantService } from './etudiant.service';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit, AfterViewInit {
  listEtudiant: User[] = [];
  filteredEtudiant: User[] = [];
  searchInput: string = '';
  successMsg: string = '';
  errorMsg: string = '';
  etudiant: User = {
    id: "",
    nom: "",
    prenom: "",
    fonction: '',
    email: '',
    adresse: '',
    password: '',
    telephone: '',
    dateNaissance: ''
  };

  @ViewChild('etudiantFormContainer', { static: true }) modalElement!: ElementRef;
  modalInstance!: Modal
  constructor(private etudiantService: EtudiantService) { }
  isEtudiantInitialized(): boolean {
    return this.etudiant.nom === '' || this.etudiant.prenom === "";
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
      // console.log("ss")
      this.listEtudiant = data;
      this.filteredEtudiant = data;
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
          modalTitle.innerHTML = 'Nouveau Etudiant';
          saveButton.style.display = 'block';
        } else {
          modalTitle.innerHTML = 'Informations du Etudiant';
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
          dateNaissance: ''
        }
        saveButton.style.display = 'none';
        editButton.style.display = 'none';
      });
    }
  }
  openModal(etudiant: User): void {
    // const modalElement = document.getElementById('etudiantFormContainer');
    if (this.modalElement) {
      this.etudiant = { ...etudiant }
      // const modal = new Modal(modalElement);
      this.modalInstance.show();
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
    this.handleAlert("error", "Fonctionnalité en cours d'integration");
    // const modalElement = document.getElementById('etudiantFormContainer');
    /*if (!this.isEtudiantInitialized()) {
      this.etudiantService.editEtudiant(this.etudiant).subscribe({
        next: (resp) => {
          console.log('Etudiant edit:', resp);
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
          this.onfetchData()
          this.handleAlert("success", 'Etudiant modifié avec succès');

        },
        error: (err) => console.error('Error editing etudiant:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    } */

  }
  onDelete(id: string): void {
    this.handleAlert("error", "Fonctionnalité en cours d'integration");
    /* this.etudiantService.deleteEtudiant(id).subscribe((isDeleted) => {
      if (isDeleted) {
        // this.listEtudiant = this.listEtudiant.filter(etudiant => etudiant.id !== id);
        this.onfetchData()
        this.handleAlert("success", 'Etudiant supprimé avec succès');

      } else {
        console.error(`Failed to delete etudiante with id ${id}`);
      }
    }); */
  }

  onSearch(): void {
    const normalizedSearchTerm = this.searchInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (normalizedSearchTerm) {
      this.filteredEtudiant = this.listEtudiant.filter((etudiant) =>
        etudiant?.nom
          ?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(normalizedSearchTerm) ||
        etudiant?.prenom
          ?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(normalizedSearchTerm)

      );

      if (this.filteredEtudiant.length === 0) {
        console.error('Aucun résultat');
        this.handleAlert("error", 'Aucun résultat');
      }
    } else {
      this.filteredEtudiant = [...this.listEtudiant];
    }
  }
}
