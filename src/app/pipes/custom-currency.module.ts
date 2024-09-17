// src/app/pipes/custom-currency.module.ts
import { NgModule } from '@angular/core';
import {CustomCurrencyPipe} from "../CustomCurrencyPipe";


@NgModule({
  declarations: [CustomCurrencyPipe],
  exports: [CustomCurrencyPipe]
})
export class CustomCurrencyModule {}
