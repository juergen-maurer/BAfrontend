import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import {provideHttpClient} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EnumFormatterPipe} from "./EnumFormatterPipe";
import { NotificationComponent } from './notification/notification.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import {LoginComponent} from "./login/login.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import { CheckoutComponent } from './checkout/checkout.component';
import {CustomCurrencyPipe} from "./CustomCurrencyPipe";


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CartComponent,
    EnumFormatterPipe,
    NotificationComponent,
    UserProfileComponent,
    LoginComponent,
    ProductDetailsComponent,
    CheckoutComponent,
    CustomCurrencyPipe
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
