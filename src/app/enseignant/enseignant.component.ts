import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnseignantService } from './enseignant.service';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.css'],
})
export class EnseignantComponent implements OnInit {
  enseignants: any[] = [];
  filteredEnseignants: any[] = [];
  enseignantForm!: FormGroup;
  isEditMode = false;
  currentEnseignantId: number | null = null;
  showForm = false; // Variable pour contrôler l'affichage du formulaire
  showTable = true;
  selectedEnseignant: any = null; // Enseignant sélectionné pour modification ou suppression

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit(): void {
    // Exemple de données d'enseignants, y compris Pierre
    /* this.enseignants = [
      {
        id: 1,
        prenom: 'Pierre',
        nom: 'Jean',
        email: 'pierre@gmail.com',
        adresse: 'France',
        telephone: '98765432',
        dateNaissance: '01/01/2000'
      },
    ];

    this.filteredEnseignants = [...this.enseignants]; */
    this.enseignantService.getAllEnseignant().subscribe((data) => {
      // console.log("ss")
      this.enseignants = data;
      this.filteredEnseignants = data;
    });

    // Initialisation du formulaire
    this.enseignantForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      dateNaissance: ['', Validators.required],
    });
  }

  // Méthode pour voir l'enseignant
  viewEnseignant(enseignant: any): void {
    this.selectedEnseignant = enseignant;
    this.enseignantForm.patchValue(enseignant); // Remplir le formulaire avec les données de l'enseignant
    this.showForm = true;
    this.showTable = false; // Masquer le tableau lorsqu'on voit un enseignant
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.selectedEnseignant = null;
    this.enseignantForm.reset();
  }

  // Méthode pour filtrer les enseignants dans le tableau
  filterEnseignants(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredEnseignants = this.enseignants.filter((enseignant) =>
      `${enseignant.nom} ${enseignant.prenom}`.toLowerCase().includes(value)
    );
  }

  // Méthode pour associer un enseignant à une autre tâche
  associateEnseignant(enseignant: any): void {
    console.log("Associer l'enseignant:", enseignant);
  }

  // Méthode pour soumettre les modifications du formulaire
  onSubmit(): void {
    const enseignant = this.enseignantForm.value;

    if (this.enseignantForm.valid) {
      // Si on est en mode modification
      if (this.isEditMode && this.selectedEnseignant) {
        const index = this.enseignants.findIndex(
          (e) => e.id === this.selectedEnseignant.id
        );
        if (index !== -1) {
          this.enseignants[index] = {
            ...enseignant,
            id: this.selectedEnseignant.id,
          };
        }
        this.isEditMode = false;
      } else {
        // Ajout d'un nouvel enseignant
        const newId = this.enseignants.length
          ? this.enseignants[this.enseignants.length - 1].id + 1
          : 1;
        this.enseignants.push({ ...enseignant, id: newId });
      }

      this.filteredEnseignants = [...this.enseignants];
      this.resetForm();
      this.showForm = false; // Ferme le formulaire après soumission
    }
  }

  // Méthode pour supprimer un enseignant
  deleteEnseignant(id: number): void {
    this.enseignants = this.enseignants.filter(
      (enseignant) => enseignant.id !== id
    );
    this.filteredEnseignants = this.enseignants;
    this.resetForm();
    this.showForm = false; // Ferme le formulaire après suppression
  }

  // Méthode pour afficher ou masquer le formulaire
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}
