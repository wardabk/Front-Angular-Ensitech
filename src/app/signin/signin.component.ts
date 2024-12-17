import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from './../user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email = '';
  password = '';
  error = '';


  constructor(private authService: AuthService, private router: Router) {

  }

  signIn(): void {
    // Réinitialiser l'erreur au début
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'email et mot de passe requis';
      return;
    }



    this.authService.login(this.email, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          const connectedUser: User | null = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!)
            : null;
          if (connectedUser?.fonction === "Directeur") {
            this.router.navigate(['/home']);
          } else if (connectedUser?.fonction === "Responsable des études") {
            this.router.navigate(['/etudiants']);
          }
        } else {
          this.error = 'Email ou Mot de passe incorrect';
        }
      },
      (err) => {
       
        this.error = "Une erreur s'est produite";
        console.error('Erreur d\'authentification:', err); // Enregistrer l'erreur pour débogage
      }
    );
  }

}
