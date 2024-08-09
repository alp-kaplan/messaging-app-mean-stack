import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './admin-components/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api-service/api.service';
import { LoginComponent } from './login/login.component';
import { InboxComponent } from './common-components/inbox/inbox.component';
import { OutboxComponent } from './common-components/outbox/outbox.component';
import { SendMessageComponent } from './common-components/send-message/send-message.component';
import {NgxPaginationModule} from "ngx-pagination";
import { LogComponent } from './admin-components/log/log.component';
import { MenuComponent } from './menu/menu.component';
import { UserEditCreateComponent } from './admin-components/user-edit-create/user-edit-create.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    LoginComponent,
    InboxComponent,
    OutboxComponent,
    SendMessageComponent,
    LogComponent,
    MenuComponent,
    UserEditCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
