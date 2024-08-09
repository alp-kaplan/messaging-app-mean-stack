import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from "jwt-decode";
import { Router } from '@angular/router';

/**
 * Service to handle authentication.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Log in a user with username and password.
   */
  login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.baseUrl}/user/login`, { username, password }).subscribe(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   * Log out the current user.
   */
  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<any>(`${this.baseUrl}/user/logout`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe();
    }
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  /**
   * Get the current user's token.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get the current user's username from the token.
   */
  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.username;
    }
    return null;
  }

  /**
   * Check if the current user is an admin.
   */
  isAdmin() {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.isAdmin;
    }
    return false;
  }

}
