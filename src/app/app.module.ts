import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import {CartService} from "./services/cart.service";
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {EnumFormatterPipe} from "./EnumFormatterPipe";
import { NotificationComponent } from './notification/notification.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {AuthService} from "./services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CartComponent,
    EnumFormatterPipe,
    NotificationComponent,
    UserProfileComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
    ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
