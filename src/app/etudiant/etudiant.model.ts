// etudiant.model.ts
import { Etudiant } from './etudiant.interface';

export class EtudiantModel implements Etudiant {
    id: number | null;
    nom: string;
    prenom: string;
    telephone: string;
    dateNaissance: Date;
    adresse: string; // Ajoutez cette ligne pour la propriété adresse
    
    constructor(data: Etudiant) {
        this.id = data.id;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.telephone = data.telephone;
        this.dateNaissance = data.dateNaissance || new Date();
        this.adresse = data.adresse || ''; // Définit une chaîne vide par défaut
    }

    static fromJSON(json: any): EtudiantModel {
        return new EtudiantModel({
            id: json.id,
            nom: json.nom,
            prenom: json.prenom,
            telephone: json.telephone,
            dateNaissance: new Date(json.dateNaissance),
            adresse: json.adresse // Inclut l'adresse lors de la transformation JSON
        });
    }
}
