import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';
import { Note } from './note.interface';
import { NoteService } from './note.service';
import { Cours } from '../cours/cours.interface';
import { User } from '../user';
import { CoursService } from './../cours/cours.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, AfterViewInit {
  listNote: Note[] = [];
  filteredNote: Note[] = [];

  listCours: Cours[] = [];
  selectedCours: Cours = {
    id: "",
    theme: "",
    nbreHeure: 0
  };

  listEtudiant: User[] = [];
  selectedEtudiant: User = {
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
  listEnseignant: User[] = [];
  selectedEnseignant: User = {
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

  searchInput: string = '';
  successMsg: string = '';
  errorMsg: string = '';
  note: Note = {
    id: "",
    idEtudiant: "",
    nomEtudiant: "",
    idCours: "",
    themeCours: "",
    idEnseignant: "",
    nomEnseignant: "",
    valeur: 0
  };

  @ViewChild('noteFormContainer', { static: true }) modalElement!: ElementRef;
  modalInstance!: Modal
  constructor(private noteService: NoteService, private coursService: CoursService) {
  }
  isNoteInitialized(): boolean {
    return this.note.idEtudiant === '' || this.note.idCours === '' || this.note.idEnseignant === '' || this.note.valeur === 0;
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
    this.noteService.getAllNote().subscribe((data) => {
      this.listNote = data;
      this.filteredNote = data;
    });

    this.coursService.getAllCours().subscribe((data) => {
      this.listCours = data;
    });
    fetch('http://localhost:3000/etudiant')
      .then((res: { json: () => any; }) => res.json())
      .then((data: User[]) => this.listEtudiant = data)
      .catch((error: any) => console.error('Error fetching data:', error));

    fetch('http://localhost:3000/enseignant')
      .then((res: { json: () => any; }) => res.json())
      .then((data: User[]) => this.listEnseignant = data)
      .catch((error: any) => console.error('Error fetching data:', error));
  }
  ngOnInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.onfetchData()
  }
  ngAfterViewInit() {
    // const modalElement = document.getElementById('noteFormContainer');
    const modalTitle = document.getElementById('modal-title');
    const formElement = document.getElementById('noteForm') as HTMLFormElement;
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');


    if (this.modalElement && modalTitle && formElement && saveButton && editButton) {
      saveButton.style.display = 'none';
      editButton.style.display = 'none';
      this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {
        if (this.isNoteInitialized()) {
          modalTitle.innerHTML = 'Nouvelle Note';
          saveButton.style.display = 'block';
        } else {
          modalTitle.innerHTML = 'Informations de la Note';
          editButton.style.display = 'block';
        }
      });

      this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
        modalTitle.innerHTML = '';
        formElement.reset();
        this.note = {
          id: "",
          idEtudiant: "",
          nomEtudiant: "",
          idCours: "",
          themeCours: "",
          idEnseignant: "",
          nomEnseignant: "",
          valeur: 0
        }

        saveButton.style.display = 'none';
        editButton.style.display = 'none';
      });
    }
  }
  openModal(note: Note): void {
    // const modalElement = document.getElementById('noteFormContainer');
    if (this.modalElement) {
      this.note = { ...note }
      // const modal = new Modal(modalElement);
      this.modalInstance.show();
    }
  }
  onSave(): void {

    if (!this.isNoteInitialized()) {
      const lastId = Math.max(...this.listNote.map(i => Number(i.id)));
      const newNote = { ...this.note, ...{ id: `${lastId + 1}` } }
      // const newNote = { ...this.note, ...{ id: lastId + 1 } }
      this.noteService.addNote(newNote).subscribe({
        next: (resp) => {
          console.log('Note saved:', resp);

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
          this.handleAlert("success", 'Note enregistré avec succès');

        },
        error: (err) => console.error('Error saving notee:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    }


  }
  onEdit(): void {
    // const modalElement = document.getElementById('noteFormContainer');
    if (!this.isNoteInitialized()) {
      this.noteService.editNote(this.note).subscribe({
        next: (resp) => {
          console.log('Note edit:', resp);
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
          this.handleAlert("success", 'Note modifiée avec succès');

        },
        error: (err) => console.error('Error editing note:', err)
      });
    } else {
      this.handleAlert("error", 'Veuillez remplir tous les champs');
    }

  }
  onDelete(id: string): void {
    this.noteService.deleteNote(id).subscribe((isDeleted) => {
      if (isDeleted) {
        // this.listNote = this.listNote.filter(note => note.id !== id);
        this.onfetchData()
        this.handleAlert("success", 'Note supprimée avec succès');

      } else {
        console.error(`Failed to delete note with id ${id}`);
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
    const normalizedSearchTerm = this.normalizeText(this.searchInput)
    if (normalizedSearchTerm) {
      this.filteredNote = this.listNote.filter((note) =>
        this.normalizeText(note?.nomEtudiant).includes(normalizedSearchTerm) ||
        this.normalizeText(note?.themeCours).includes(normalizedSearchTerm) ||
        this.normalizeText(note?.nomEnseignant).includes(normalizedSearchTerm) ||
        note?.valeur.toString().includes(normalizedSearchTerm)
      )
      /* this.filteredNote = this.listNote.filter((note) =>
        note?.nomEtudiant
          ?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(normalizedSearchTerm) ||
        note?.valeur.toString().includes(normalizedSearchTerm)
      );  */

      if (this.filteredNote.length === 0) {
        console.error('Aucun résultat');
        this.handleAlert("error", 'Aucun résultat');
      }
    } else {
      this.filteredNote = [...this.listNote];
    }
  }
}

