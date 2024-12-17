// etudiant.interface.ts
export interface Etudiant {
    id: number | null;
    nom: string;
    prenom: string;
    telephone: string;
    dateNaissance: Date;
    adresse: string; // Ajout de l'adresse à l'interface
}
