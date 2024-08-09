import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api-service/api.service';
import { AuthService } from '../../auth-service/auth.service';

/**
 * Component for viewing the inbox messages.
 */
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  inboxMessages: any[] = [];
  p: number = 1;
  totalMessages: number; // Total number of messages
  itemsPerPage: number = 10; // Number of items per page
  sortField: string = 'timestamp';
  sortOrder: string = 'desc';
  filterSender: string = '';
  filterContent: string = '';
  startDate: string = '';
  endDate: string = '';
  isAdmin: boolean = this.authService.isAdmin();

  constructor(private apiService: ApiService, public authService: AuthService) {}

  /**
   * Initialize the component by fetching inbox messages.
   */
  ngOnInit(): void {
    this.viewInbox();
  }

  /**
   * Fetches inbox messages from the API.
   */
  viewInbox() {
    this.apiService.getMessages(
      'in', this.p, this.itemsPerPage, this.sortField, this.sortOrder,
      this.filterSender, '', this.filterContent, this.startDate, this.endDate
    ).subscribe(data => {
      this.inboxMessages = data.messages;
      this.totalMessages = data.totalMessages;
    }, error => {
      console.error('Error fetching outbox:', error);
    });
  }

  /**
   * Handles page change for pagination.
   * @param event The new page number.
   */
  pageChanged(event: number) {
    this.p = event;
    this.viewInbox();
  }

  /**
   * Handles sorting of messages by the specified field.
   * @param field The field to sort by.
   */
  sortMessages(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.viewInbox();
  }

  /**
   * Returns the CSS class for the sort arrow based on the current sort field and order.
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
   * Checks if the previous page button should be enabled.
   * @returns True if the previous page button should be enabled, otherwise false.
   */
  canGoPrevious(): boolean {
    return this.p > 1;
  }

  /**
   * Checks if the next page button should be enabled.
   * @returns True if the next page button should be enabled, otherwise false.
   */
  canGoNext(): boolean {
    return this.p < this.totalPages;
  }

  /**
   * Calculates the total number of pages.
   * @returns The total number of pages.
   */
  get totalPages(): number {
    return Math.ceil(this.totalMessages / this.itemsPerPage);
  }

  /**
   * Generates an array of page numbers for pagination.
   * @returns An array of page numbers.
   */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Handles change in items per page and resets to the first page.
   */
  itemsPerPageChanged() {
    this.p = 1; // Reset to the first page
    this.viewInbox();
  }

  /**
   * Handles filter change and resets to the first page.
   */
  onFilterChange() {
    this.p = 1;
    this.viewInbox();
  }

  /**
   * Deletes a message by its ID after user confirmation.
   * @param messageId The ID of the message to delete.
   */
  deleteMessage(messageId: string) {
    if (window.confirm('Are you sure?')){
      this.apiService.deleteMessage(messageId).subscribe(() => {
        this.viewInbox();
        alert('Message successfully deleted!');
      }, error => {
        console.error('Error deleting message:', error);
      });
    }
  }

}
