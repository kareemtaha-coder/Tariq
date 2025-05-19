import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('tabs') tabsContainer!: ElementRef;
  @ViewChild('tiltCard') tiltCard!: ElementRef;

  activeTab: string = 'vision';
  isMobile: boolean = false;

  features = [
    {
      icon: 'school',
      title: 'Expert Instructors',
      description: 'Learn from qualified scholars with ijazah in Quran and Islamic sciences.',
      color: 'blue'
    },
    {
      icon: 'sensors',
      title: 'Interactive Learning',
      description: 'Engage with our innovative teaching methods designed for better retention.',
      color: 'green'
    },
    {
      icon: 'schedule',
      title: 'Flexible Schedule',
      description: 'Choose from various time slots that fit your daily routine.',
      color: 'amber'
    },
    {
      icon: 'menu_book',
      title: 'Authentic Curriculum',
      description: 'Curriculum developed by scholars following traditional Islamic methodology.',
      color: 'rose'
    }
  ];

  statistics = [
    { value: 500, label: 'Students', icon: 'school' },
    { value: 20, label: 'Tutors', icon: 'person' },
    { value: 15, label: 'Courses', icon: 'menu_book' }
  ];

  tabContent = {
    vision: 'To be a leading institution in Quranic education, empowering individuals with authentic knowledge and spiritual growth while fostering a deeper connection with the Quran.',
    mission: 'To provide accessible, high-quality Quranic education through innovative teaching methods, personal mentorship, and a supportive learning environment that respects diverse backgrounds and abilities.',
    values: 'Excellence in teaching, authenticity in knowledge, respect for tradition, inclusivity for all learners, and continuous improvement in our educational approaches.',
    approach: 'We combine traditional Islamic teaching methods with modern educational techniques, focusing on proper pronunciation (tajweed), memorization (hifz), understanding (tafsir), and practical application in daily life.'
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
    if (this.tiltCard && !this.isMobile) {
      this.setupTiltEffect();
    } else if (this.tiltCard && this.isMobile) {
      this.removeTiltEffect();
    }
  }

  ngOnInit() {
    this.checkIfMobile();
    // Trigger animations for elements that should animate on load
    this.setupAnimations();
  }

  ngAfterViewInit() {
    // Only setup tilt effect if not on mobile
    if (this.tiltCard && !this.isMobile) {
      this.setupTiltEffect();
    }

    // Set the first tab as active
    setTimeout(() => {
      if (this.tabsContainer) {
        const firstTabButton = this.tabsContainer.nativeElement.querySelector('.tab-button');
        if (firstTabButton) {
          firstTabButton.classList.add('active');
        }
      }
    }, 0);
  }

  setActiveTab(tab: string, event: Event) {
    event.preventDefault();
    this.activeTab = tab;

    // Update active class on tab buttons
    if (this.tabsContainer) {
      const tabButtons = this.tabsContainer.nativeElement.querySelectorAll('.tab-button');
      tabButtons.forEach((button: HTMLElement) => {
        if (button.getAttribute('data-tab') === tab) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  private setupAnimations() {
    // Add staggered animations to elements with animate-fade-up class
    const animatedElements = document.querySelectorAll('.animate-fade-up');

    // Limit the number of animated elements on mobile to improve performance
    const elementsToAnimate = this.isMobile ? 5 : animatedElements.length;

    for (let i = 0; i < elementsToAnimate && i < animatedElements.length; i++) {
      const el = animatedElements[i] as HTMLElement;
      el.style.animationDelay = `${i * 0.1}s`;
    }
  }

  private setupTiltEffect() {
    if (!this.tiltCard || !this.tiltCard.nativeElement) return;

    try {
      const card = this.tiltCard.nativeElement;
      const spotlight = card.querySelector('.spotlight-effect');

      // Remove any existing event listeners
      this.removeTiltEffect();

      // Mouse move event for tilt effect
      card.addEventListener('mousemove', this.handleTiltMove);

      // Reset on mouse leave
      card.addEventListener('mouseleave', this.handleTiltLeave);
    } catch (error) {
      console.error('Error setting up tilt effect:', error);
    }
  }

  private handleTiltMove = (e: MouseEvent) => {
    try {
      const card = this.tiltCard.nativeElement;
      const spotlight = card.querySelector('.spotlight-effect');
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limit the rotation angle for better compatibility
      const maxRotation = 5;
      const rotateX = Math.max(-maxRotation, Math.min(maxRotation, (y - centerY) / 20));
      const rotateY = Math.max(-maxRotation, Math.min(maxRotation, (centerX - x) / 20));

      // Apply the transform with a safer approach
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Update spotlight position
      if (spotlight) {
        spotlight.style.opacity = '1';
        spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 80%)`;
      }
    } catch (error) {
      console.error('Error in tilt move handler:', error);
    }
  }

  private handleTiltLeave = () => {
    try {
      const card = this.tiltCard.nativeElement;
      const spotlight = card.querySelector('.spotlight-effect');

      // Smoothly reset the transform
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

      if (spotlight) {
        spotlight.style.opacity = '0';
      }
    } catch (error) {
      console.error('Error in tilt leave handler:', error);
    }
  }

  private removeTiltEffect() {
    if (!this.tiltCard || !this.tiltCard.nativeElement) return;

    try {
      const card = this.tiltCard.nativeElement;
      card.removeEventListener('mousemove', this.handleTiltMove);
      card.removeEventListener('mouseleave', this.handleTiltLeave);

      // Reset any applied styles
      card.style.transform = '';

      const spotlight = card.querySelector('.spotlight-effect');
      if (spotlight) {
        spotlight.style.opacity = '';
        spotlight.style.background = '';
      }
    } catch (error) {
      console.error('Error removing tilt effect:', error);
    }
  }

  // Helper function to determine if it's dark mode
  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
