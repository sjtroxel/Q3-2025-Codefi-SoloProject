import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
constructor(
    public authService: AuthenticationService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    document.body.classList.toggle('dark-mode', checked);
}
}
