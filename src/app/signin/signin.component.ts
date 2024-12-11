import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email = '';
  password = '';
  error = '';
  constructor(private authService: AuthService, private router: Router) { }

  signIn(): void {
    if (!this.email || !this.password) {
      this.error = 'email et mot de passe requis';
      return;
    }
    this.authService.login(this.email, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/home']);
        } else {
          this.error = 'Email ou Mot de passe incorrect';
        }
      },
      (err) => {
        this.error = "Une erreur s'est produite";
      }
    );
  }

}
