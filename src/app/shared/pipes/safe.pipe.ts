import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
    return null;
  }
}
