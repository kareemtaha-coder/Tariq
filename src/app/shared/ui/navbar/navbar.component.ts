import { ViewportScroller } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContactsService } from '../../../Core/services/contacts.service';
import { LoginService } from '../../../Core/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports:[RouterLink]
})
export class NavbarComponent {
  private initialDark = localStorage.getItem('theme') === 'dark';
  token=signal<boolean>(localStorage.getItem('token') !='')
  themeDark = signal(this.initialDark);
  mobileMenuOpen = signal(false);
  coursesMenuOpen = signal(false);
  loginService= inject(LoginService)
  isUserLogedIn = this.loginService.isUserLoggedIn
  scroller=inject(ViewportScroller)
  constructor(private router: Router) {
    effect(() => {
      if (this.themeDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', this.themeDark() ? 'dark' : 'light');
    });
  }
 // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
      this.closeMobileMenu();
    }
  }
  toggleTheme() {
    this.themeDark.set(!this.themeDark());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    if (!this.mobileMenuOpen()) {
      this.coursesMenuOpen.set(false);
    }
  }

  toggleCoursesMenu() {
    this.coursesMenuOpen.set(!this.coursesMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.coursesMenuOpen.set(false);
  }


navigateToFragment(fragment: string) {
    this.scroller.scrollToAnchor(fragment)
}
  contactService = inject(ContactsService)



  logout(){
    this.loginService.logout();
    this.isUserLogedIn.set(false)
  }
}
