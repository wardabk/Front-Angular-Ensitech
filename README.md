ENSITECH
## Description
Application web conçue pour centraliser et optimiser la gestion  d'une école d’enseignement supérieure.
## Fonctionalités
 - Authentification
 - Gestion des étudiants (Créer, modifier, supprimer, lister,afficher les détails, associer étudiant à un cours)
 - Gestion des enseignants (Créer, modifier, supprimer, lister,afficher les détails, associer enseignant à un cours)
 - Gestion des cours (Créer, modifier, supprimer, lister, afficher les détails)
 - Gestion des notes (Créer, modifier, supprimer, lister, afficher les détails)
 - Visualisation de statistique
## Technologies Utilisées
 - Angular
 - Docker

## Contributeurs
 - Jean Batiste Goumou
 - Warda Boubaker
 - Oumou Sow
 - Djimo Gassama

## Build Docker Image
 - docker build -t glowriousmou/ensitech-10kc-groupe4 .
## Push  Docker Image
 - docker push  glowriousmou/ensitech-10kc-groupe4
## Run  Docker Image
 - docker run -p 4200:4200 -p 3000:3000   glowriousmou/ensitech-10kc-groupe4