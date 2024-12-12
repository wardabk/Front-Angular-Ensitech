import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  isCollapsed = false;
  connectedUser: User | null = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!)
    : null;
  menuItems = [
    { title: 'Etudiants', icon: 'fa-solid fa-graduation-cap', route: '/etudiants' },
    { title: 'Enseignants', icon: 'fas fa-user', route: '/enseignants' },
    { title: 'Cours', icon: 'fa-solid fa-book', route: '/cours' },
    { title: 'Notes', icon: 'fa-solid fa-file-signature', route: '/notes' },
  ];
  constructor(private authService: AuthService, private router: Router) {

  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }



  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }


}
