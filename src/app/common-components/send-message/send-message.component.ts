import { Component } from '@angular/core';
import { AuthService } from '../../auth-service/auth.service';
import {ApiService} from "../../api-service/api.service";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Component for sending a new message.
 */
@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent {
  newMessageReceiver: string = '';
  newMessageContent: string = '';
  isAdmin: boolean = this.authService.isAdmin();

  private searchTerms = new Subject<string>();
  filteredUsers: any[] = [];

  constructor(private router: Router, public authService: AuthService, private apiService: ApiService) {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.apiService.searchUsers(term))
    ).subscribe(users => this.filteredUsers = users);
  }

  /**
   * Sends a new message if receiver and content are provided.
   */
  sendMessage() {
    if (this.newMessageReceiver && this.newMessageContent) {
      this.apiService.sendMessage(this.newMessageReceiver, this.newMessageContent).subscribe(response => {
        console.log('Message sent:', response);
        this.newMessageReceiver = '';
        this.newMessageContent = '';
        this.filteredUsers = [];
        alert('Message sent!');
        this.router.navigate(['/outbox']);
      }, error => {
        console.error('Error sending message:', error);
        alert('Receiver does not exist!');
      });
    } else {
      console.error('Receiver and content are required to send a message!');
      alert('Receiver and content are required to send a message!');
    }
  }

  /**
   * Triggers user search based on receiver input.
   */
  onReceiverInput(): void {
    this.searchTerms.next(this.newMessageReceiver);
  }

  /**
   * Selects a receiver from the filtered users list.
   * @param username The username of the selected receiver.
   */
  selectReceiver(username: string): void {
    this.newMessageReceiver = username;
    this.filteredUsers = [];
  }

}
