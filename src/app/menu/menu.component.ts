import { Component } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';

/**
 * Component for the application menu.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isAdmin: boolean = this.authService.isAdmin();

  constructor(public authService: AuthService) {}

}
