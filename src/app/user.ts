// import { Cours } from "./cours/cours.interface";

export interface User {
    id: string;
    prenom: string;
    nom: string;
    fonction: string;
    email: string;
    adresse: string;
    password: string;
    telephone: string;
    dateNaissance: string;
    // cours: Cours
}
