import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import {AuthService} from "../auth-service/auth.service";
import { Router } from '@angular/router';

/**
 * Service to handle API requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUri: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private authService: AuthService, private router: Router)
  {
    this.errorMgmt = this.errorMgmt.bind(this);
  }

  /**
   * Fetch logs with optional filters and pagination.
   */
  getLogs(
    page: number = 1,
    limit: number = 10,
    sortField: string = 'requestTime',
    sortOrder: string = 'asc',
    filterUsername?: string,
    filterIP?: string,
    filterBrowser?: string,
    filterEndpoint?: string,
    filterMethod?: string,
    filterStatusCode?: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (filterUsername) params = params.set('filterUsername', filterUsername);
    if (filterIP) params = params.set('filterIP', filterIP);
    if (filterBrowser) params = params.set('filterBrowser', filterBrowser);
    if (filterEndpoint) params = params.set('filterEndpoint', filterEndpoint);
    if (filterMethod) params = params.set('filterMethod', filterMethod);
    if (filterStatusCode) params = params.set('filterStatusCode', filterStatusCode);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.baseUri}/log`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` },
      params: params,
    }).pipe(
      map((res: any) => res || {}),
      catchError(this.errorMgmt)
    );
  }

  /**
   * Fetch messages with optional filters and pagination.
   */
  getMessages(
    inout: 'in' | 'out',
    page: number = 1,
    limit: number = 10,
    sortField: string = 'timestamp',
    sortOrder: string = 'asc',
    filterSender?: string,
    filterReceiver?: string,
    filterContent?: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('inout', inout)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (filterSender) params = params.set('filterSender', filterSender);
    if (filterReceiver) params = params.set('filterReceiver', filterReceiver);
    if (filterContent) params = params.set('filterContent', filterContent);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any>(`${this.baseUri}/message`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` },
      params: params,
    }).pipe(
      map((res: any) => res || {}),
      catchError(this.errorMgmt)
    );
  }

  /**
   * Send a message.
   */
  sendMessage(receiver: string, content: string): Observable<any> {
    const sender = this.authService.getUsername(); // Assuming the authService has a method to get the username
    return this.http.post<any>(`${this.baseUri}/message/send`, { sender, receiver, content }, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    });
  }

  /**
   * Search for users by username.
   */
  searchUsers(term: string): Observable<any[]> {
    if (!term.trim()) {
      return new Observable(observer => observer.next([]));
    }
    return this.http.get<any[]>(`${this.baseUri}/user/search?username=${term}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}`}
    });
  }

  /**
   * Create a new user.
   */
  createUser(data): Observable<any> {
    let url = `${this.baseUri}/user/create`;
    return this.http.post(url, data, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}`}
    }).pipe(catchError(this.errorMgmt));
  }

  /**
   * Fetch users with optional filters, pagination, and sorting.
   */
  getUsers(
    page: number = 1,
    limit: number = 10,
    sortField: string = 'username',
    sortOrder: string = 'asc',
    filterUsername?: string,
    filterName?: string,
    filterSurname?: string,
    filterGender?: string,
    filterEmail?: string,
    filterLocation?: string,
    startDate?: string,
    endDate?: string,
    filterAdmin?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (filterUsername) params = params.set('filterUsername', filterUsername);
    if (filterName) params = params.set('filterName', filterName);
    if (filterSurname) params = params.set('filterSurname', filterSurname);
    if (filterGender) params = params.set('filterGender', filterGender);
    if (filterEmail) params = params.set('filterEmail', filterEmail);
    if (filterLocation) params = params.set('filterLocation', filterLocation);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (filterAdmin && filterAdmin !== 'all') params = params.set('isAdmin', filterAdmin);

    return this.http.get<any>(`${this.baseUri}/user`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` },
      params: params
    }).pipe(
      map((res: any) => res || {}),
      catchError(this.errorMgmt)
    );
  }

  /**
   * Fetch a single user by ID.
   */
  getUser(id): Observable<any> {
    let url = `${this.baseUri}/user/read/${id}`;
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}`}
    }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /**
   * Update a user by ID.
   */
  updateUser(id, data): Observable<any> {
    let url = `${this.baseUri}/user/update/${id}`;
    return this.http
      .put(url, data, {
        headers: { Authorization: `Bearer ${this.authService.getToken()}`}
      }).pipe(catchError(this.errorMgmt));
  }

  /**
   * Delete a user by ID.
   */
  deleteUser(id): Observable<any> {
    let url = `${this.baseUri}/user/delete/${id}`;
    return this.http
      .delete(url, {
        headers: { Authorization: `Bearer ${this.authService.getToken()}`}
      })
      .pipe(catchError(this.errorMgmt));
  }

  /**
   * Delete a message by ID.
   */
  deleteMessage(messageId: string): Observable<any> {
    const url = `${this.baseUri}/message/delete/${messageId}`;
    return this.http.delete(url, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}`}
    }).pipe(catchError(this.errorMgmt));
  }

  /**
   * Error handling method.
   * @param error The error response.
   * @returns Throws an observable error.
   */
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 401) {
        alert("Unauthorized!");
        this.authService.logout();
        this.router.navigate(['/login']);
      }
      else if (error.status === 403) {
        alert("You are no longer an admin!");
        this.router.navigate(['/non-admin']);
      }
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
