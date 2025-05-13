import { Component } from '@angular/core';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-arabic',
  imports: [SafePipe],
  templateUrl: './arabic.component.html',
  styleUrl: './arabic.component.css',
})
export class ArabicComponent {}
