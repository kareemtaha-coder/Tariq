import { CommonModule, ViewportScroller } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContactsService } from '../../../Core/services/contacts.service';
import { LoginService } from '../../../Core/services/login.service';
import { ContactFormModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, CommonModule, ContactFormModalComponent],
  standalone: true,
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private initialDark = localStorage.getItem('theme') === 'dark';
  token = signal<boolean>(localStorage.getItem('token') != '');
  themeDark = signal(this.initialDark);
  mobileMenuOpen = signal(false);
  coursesMenuOpen = signal(false);
  navScrolled = signal(false);

  @ViewChild('mobileMenu') mobileMenuRef!: ElementRef;

  loginService = inject(LoginService);
  isUserLogedIn = this.loginService.isUserLoggedIn;
  scroller = inject(ViewportScroller);
  contactService = inject(ContactsService);

  constructor(private router: Router) {
    effect(() => {
      if (this.themeDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', this.themeDark() ? 'dark' : 'light');
    });

    effect(() => {
      if (this.mobileMenuOpen()) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        this.coursesMenuOpen.set(false);
      }
    });
  }

  ngOnInit() {
    this.checkScroll();
  }

  ngAfterViewInit() {
    this.setupMobileMenuEffects();
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    const scrollPosition = window.scrollY;
    this.navScrolled.set(scrollPosition > 20);
  }

  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }

  private setupMobileMenuEffects() {
    if (this.mobileMenuRef?.nativeElement) {
      const menu = this.mobileMenuRef.nativeElement;

      const menuItems = menu.querySelectorAll('.mobile-link');
      menuItems.forEach((item: HTMLElement, index: number) => {
        item.style.animationDelay = `${index * 0.05}s`;
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      this.mobileMenuOpen() &&
      !target.closest('.mobile-menu') &&
      !target.closest('.hamburger-button') &&
      !target.closest('.menu-button') &&
      !target.closest('.mobile-accordion button')
    ) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape', [])
  onEscapePressed() {
    this.closeMobileMenu();
  }

  toggleTheme() {
    this.themeDark.set(!this.themeDark());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  toggleCoursesMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.coursesMenuOpen.set(!this.coursesMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  navigateToFragment(fragment: string) {
    this.router.navigate(['/'], { fragment });
    this.closeMobileMenu();
  }

  logout() {
    this.loginService.logout();
    this.isUserLogedIn.set(false);
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }
}
