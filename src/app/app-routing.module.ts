import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditCreateComponent } from './admin-components/user-edit-create/user-edit-create.component';
import { UserListComponent } from './admin-components/user-list/user-list.component';
import { LogComponent } from './admin-components/log/log.component';
import { InboxComponent } from './common-components/inbox/inbox.component';
import { OutboxComponent } from './common-components/outbox/outbox.component';
import { SendMessageComponent } from './common-components/send-message/send-message.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from "./menu/menu.component";

const routes: Routes = [
  { path: 'edit-create-user', component: UserEditCreateComponent },
  { path: 'edit-create-user/:id', component: UserEditCreateComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'log', component: LogComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'outbox', component: OutboxComponent },
  { path: 'send-message', component: SendMessageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
