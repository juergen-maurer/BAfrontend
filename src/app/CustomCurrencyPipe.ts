// src/app/pipes/custom-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number | undefined, currency: string = 'EUR', symbol: string = '€'): string {
    if (value!=undefined){
      return `${value.toFixed(2)}${symbol}`;
    }
    else return '';
  }
}
