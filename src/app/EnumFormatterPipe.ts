import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumFormatter'
})
export class EnumFormatterPipe implements PipeTransform {
  private readonly enumMapping: { [key: string]: string } = {
    ELECTRONICS: 'Elektronik',
    BOOKS: 'Bücher',
    HOME: 'Haushalt',
    FASHION:'Fashion',
    // Fügen Sie hier weitere Mappings hinzu
  };
  transform(value: string): string {
    if (!value) return value;
    // Ersetzen Sie Unterstriche durch Leerzeichen und wandeln Sie den String in Title Case um
    return this.enumMapping[value] || value.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase());
  }
}
