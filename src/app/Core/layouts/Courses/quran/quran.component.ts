import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-quran',
  standalone: true,
  imports: [SafePipe, CommonModule],
  templateUrl: './quran.component.html',
  styleUrl: './quran.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class QuranComponent {


}
