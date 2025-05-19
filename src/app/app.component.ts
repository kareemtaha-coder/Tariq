import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  signal
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./shared/ui/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  // Initialize theme based on localStorage or system preference
  private initialDark = (() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })();

  themeDark = signal(this.initialDark);

  constructor(private router: Router) {
    // Set initial theme class immediately
    this.applyTheme(this.initialDark);

    effect(() => {
      this.applyTheme(this.themeDark());
      localStorage.setItem('theme', this.themeDark() ? 'dark' : 'light');
    });
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
