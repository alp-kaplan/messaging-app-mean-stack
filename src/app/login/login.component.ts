import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

/**
 * Component for user login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Logs in the user with the provided username and password.
   */
  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        this.router.navigate(['/menu']);
      },
      (error) => {
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

}
