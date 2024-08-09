import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api-service/api.service';
import { AuthService } from '../../auth-service/auth.service';

/**
 * Component to display and manage log entries.
 */
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  logs: any[] = [];
  p: number = 1;
  totalLogs: number;
  itemsPerPage: number = 10;
  sortField: string = 'requestTime';
  sortOrder: string = 'desc';
  filterUsername: string = '';
  filterIP: string = '';
  filterBrowser: string = '';
  filterEndpoint: string = '';
  filterMethod: string = '';
  filterStatusCode: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private apiService: ApiService, public authService: AuthService) {
    this.fetchLogs();
  }

  ngOnInit() {}

  /**
   * Fetch logs from the server based on current filters, pagination, and sorting.
   */
  fetchLogs() {
    this.apiService.getLogs(
      this.p, this.itemsPerPage, this.sortField, this.sortOrder,
      this.filterUsername, this.filterIP, this.filterBrowser, this.filterEndpoint,
      this.filterMethod, this.filterStatusCode, this.startDate, this.endDate
    ).subscribe((data) => {
      this.logs = data.logs;
      this.totalLogs = data.totalLogs;
    });
  }

  /**
   * Change the current page and fetch the logs.
   * @param event The new page number.
   */
  pageChanged(event: number) {
    this.p = event;
    this.fetchLogs();
  }

  /**
   * Sort the logs based on the given field.
   * @param field The field to sort by.
   */
  sortLogs(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.fetchLogs();
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
   * Get the total number of pages based on the total logs and items per page.
   * @returns The total number of pages.
   */
  get totalPages(): number {
    return Math.ceil(this.totalLogs / this.itemsPerPage);
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
    this.fetchLogs();
  }

  /**
   * Handle changes in filters and fetch the logs.
   */
  onFilterChange() {
    this.p = 1;
    this.fetchLogs();
  }

}
