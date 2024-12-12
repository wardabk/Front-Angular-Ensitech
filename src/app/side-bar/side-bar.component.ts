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
    { title: 'Dashboard', icon: 'fas fa-home', route: '/home' },
    { title: 'Cours', icon: 'fas fa-user', route: '/cours' },
    // { title: 'Settings', icon: 'fas fa-cog', route: '/protected/settings' },
  ];
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(private authService: AuthService, private router: Router) { }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

}
