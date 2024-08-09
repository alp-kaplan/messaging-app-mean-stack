import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api-service/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-service/auth.service';

/**
 * Component to display and manage the list of users.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})

export class UserListComponent implements OnInit {
  User: any = [];
  p: number = 1;
  totalUsers: number;
  itemsPerPage: number = 10;
  sortField: string = 'username';
  sortOrder: string = 'asc';
  filterUsername: string = '';
  filterName: string = '';
  filterSurname: string = '';
  filterGender: string = '';
  filterEmail: string = '';
  filterLocation: string = '';
  startDate: string = '';
  endDate: string = '';
  filterAdmin: string = 'all';

  constructor(private router: Router, private apiService: ApiService, public authService: AuthService) {
    this.readUser();
  }

  ngOnInit() {}

  /**
   * Fetch users from the server based on current filters, pagination, and sorting.
   */
  readUser() {
    this.apiService.getUsers(
      this.p, this.itemsPerPage, this.sortField, this.sortOrder,
      this.filterUsername, this.filterName, this.filterSurname, this.filterGender,
      this.filterEmail, this.filterLocation, this.startDate, this.endDate, this.filterAdmin
    ).subscribe((data) => {
      this.User = data.users;
      this.totalUsers = data.totalUsers;
    });
  }

  /**
   * Remove a user after confirmation.
   * @param user The user to be removed.
   */
  removeUser(user) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deleteUser(user._id).subscribe({
        complete: () => {
          console.log('User successfully deleted!');
          alert('User successfully deleted!');
          this.readUser();
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }

  /**
   * Navigates to the user edit/create page for the specified user ID.
   * @param id - The ID of the user to edit.
   */
  onEdit(id: any) {
    this.router.navigate(['/edit-create-user/' + id]);
  }

  /**
   * Change the current page and fetch the users.
   * @param event The new page number.
   */
  pageChanged(event: number) {
    this.p = event;
    this.readUser();
  }

  /**
   * Sort the users based on the given field.
   * @param field The field to sort by.
   */
  sortUsers(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.readUser();
  }

  /**
   * Get the CSS class for the sort arrow of a given field.
   * @param field The field to get the sort arrow class for.
   * @returns The CSS class for the sort arrow.
   */
  getSortArrowClass(field: string): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'sort-arrow sort-asc' : 'sort-arrow sort-desc';
    }
    return '';
  }

  /**
   * Determine if there are previous pages available.
   * @returns True if there are previous pages, false otherwise.
   */
  canGoPrevious(): boolean {
    return this.p > 1;
  }

  /**
   * Determine if there are next pages available.
   * @returns True if there are next pages, false otherwise.
   */
  canGoNext(): boolean {
    return this.p < this.totalPages;
  }

  /**
   * Get the total number of pages based on the total users and items per page.
   * @returns The total number of pages.
   */
  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.itemsPerPage);
  }

  /**
   * Get an array of page numbers for pagination.
   * @returns An array of page numbers.
   */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Handle the change in the number of items per page.
   */
  itemsPerPageChanged() {
    this.p = 1; // Reset to the first page
    this.readUser();
  }

  /**
   * Handle changes in filters and fetch the users.
   */
  onFilterChange() {
    this.p = 1;
    this.readUser();
  }

}
