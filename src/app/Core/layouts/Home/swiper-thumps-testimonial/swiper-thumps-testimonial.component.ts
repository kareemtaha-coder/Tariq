import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  inject,
  NgZone,
  TemplateRef
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { ContactsService } from '../../../services/contacts.service';
import { register } from 'swiper/element/bundle';

// Register Swiper web components
register();

/**
 * Interface for Testimonial data structure
 */
interface Testimonial {
  name: string;
  avatar: string;
  image: string;
  shortQuote: string;
  mainQuote: string;
  course: string;
  rating: string;
}

@Component({
  selector: 'app-swiper-thumps-testimonial',
  imports: [CommonModule],
  templateUrl: './swiper-thumps-testimonial.component.html',
  styleUrl: './swiper-thumps-testimonial.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperThumpsTestimonialComponent implements OnInit, AfterViewInit, OnDestroy {
  contactService = inject(ContactsService);
  private ngZone = inject(NgZone);

  // Signal-based reactive state
  currentIndex = signal(0);
  isViewingDetails = signal(false);
  isMobile = signal(false);

  // ViewChild references for swiper containers
  @ViewChild('thumbsContainer', { static: false })
  thumbsContainer!: ElementRef<SwiperContainer>;

  @ViewChild('mainContainer', { static: false })
  mainContainer!: ElementRef<SwiperContainer>;

  @ViewChild('contactModal', { static: false })
  contactModal!: TemplateRef<any>;

  // Manage component lifecycle with RxJS
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver | null = null;

  // Testimonials data - Reduced to fit better in compact layout
  testimonials: Testimonial[] = [
    {
      name: 'Ayra Khan',
      avatar: '/1.jpg',
      image: '/1.jpg',
      shortQuote: 'I love teacher Sarah so much',
      mainQuote: 'Teacher Sarah makes Quran memorization so fun and engaging. The lessons are interactive and I look forward to them every week.',
      course: 'Quran Memorization',
      rating: '5.0'
    },
    {
      name: 'Nasar Azam',
      avatar: '/2.jpg',
      image: '/2.jpg',
      shortQuote: "Best teacher I've ever had",
      mainQuote: "The lessons are engaging and I've learned so much in such a short time. Teacher Malik's approach is both professional and friendly.",
      course: 'Islamic Studies',
      rating: '5.0'
    },
    {
      name: 'Aryan Obanta',
      avatar: '/3.jpg',
      image: '/3.jpg',
      shortQuote: 'Highly recommended',
      mainQuote: 'Patient and explains concepts so clearly. I never thought I could progress this fast in my studies.',
      course: 'Arabic Language',
      rating: '4.9'
    },
    {
      name: 'Joanna Ali',
      avatar: '/4.jpg',
      image: '/4.jpg',
      shortQuote: 'Amazing teaching style',
      mainQuote: 'Makes learning interactive and enjoyable. The curriculum is well-structured and each lesson builds perfectly on the previous one.',
      course: 'Interactive Quran',
      rating: '5.0'
    },
    {
      name: 'Isa M',
      avatar: '/5.jpg',
      image: '/5.jpg',
      shortQuote: 'Excellent mentor',
      mainQuote: 'Always goes above and beyond to help students. Teacher Ahmed not only teaches the content but also instills beautiful values.',
      course: 'Advanced Arabic',
      rating: '5.0'
    }
  ];

  ngOnInit() {
    // Check if mobile on init
    this.checkIfMobile();

    // Listen for window resize events with debounce
    let resizeTimeout: any;
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Debounce resize events
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.checkIfMobile();
          this.updateSwiperOnResize();
        }, 100);
      });

    // Listen for visibility changes to pause/resume autoplay
    this.handleVisibilityChanges();
  }

  ngAfterViewInit() {
    // Initialize swipers with compact configuration
    setTimeout(() => {
      this.initializeSwipers();
    }, 0);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Cleanup swiper instances
    this.cleanupSwipers();
  }

  /**
   * Converts string rating to number for comparison
   */
  parseFloat(value: string): number {
    return parseFloat(value);
  }

  /**
   * Check if we're on a mobile device
   */
  private checkIfMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  /**
   * Updates swiper instances on window resize
   */
  private updateSwiperOnResize() {
    if (this.mainContainer?.nativeElement?.swiper &&
        this.thumbsContainer?.nativeElement?.swiper) {

      this.ngZone.runOutsideAngular(() => {
        this.mainContainer.nativeElement.swiper.update();
        this.thumbsContainer.nativeElement.swiper.update();
      });
    }
  }

  /**
   * Initialize both swiper instances with optimized configuration for compact layout
   */
  private initializeSwipers() {
    if (!this.mainContainer?.nativeElement || !this.thumbsContainer?.nativeElement) return;

    try {
      // Configure main swiper with simplified parameters
      const mainSwiperParams = {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        speed: 600,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        grabCursor: true,
        loop: true,
        watchSlidesProgress: true,
        a11y: {
          enabled: true,
        },
        on: {
          slideChange: (swiper: any) => {
            this.ngZone.run(() => {
              this.currentIndex.set(swiper.realIndex);

              // Reset viewing details when slide changes
              if (this.isViewingDetails()) {
                this.isViewingDetails.set(false);
              }
            });
          }
        },
      };

      // Configure thumbs swiper for more compact display
      const thumbsSwiperParams = {
        slidesPerView: 'auto',
        spaceBetween: 10,
        watchSlidesProgress: true,
        centerInsufficientSlides: true,
        slideToClickedSlide: true,
        loop: true,
        breakpoints: {
          320: {
            slidesPerView: 5,
            spaceBetween: 5,
          },
          480: {
            slidesPerView: 5,
            spaceBetween: 8,
          },
          640: {
            slidesPerView: 5,
            spaceBetween: 10,
          }
        },
        on: {
          click: (swiper: any) => {
            this.ngZone.run(() => {
              if (typeof swiper.clickedIndex !== 'undefined') {
                this.goToTestimonial(swiper.realIndex);
              }
            });
          },
        },
      };

      // Apply configurations
      const main = this.mainContainer.nativeElement;
      const thumbs = this.thumbsContainer.nativeElement;

      Object.assign(main, mainSwiperParams);
      Object.assign(thumbs, thumbsSwiperParams);

      // Initialize swipers in proper order
      this.ngZone.runOutsideAngular(() => {
        thumbs.initialize();
        main.initialize();
      });
    } catch (error) {
      console.error('Error initializing swiper:', error);
    }
  }

  /**
   * Navigate to a specific testimonial
   */
  goToTestimonial(index: number) {
    if (!this.mainContainer?.nativeElement?.swiper) return;

    try {
      this.ngZone.runOutsideAngular(() => {
        this.mainContainer.nativeElement.swiper.slideToLoop(index);

        this.ngZone.run(() => {
          this.currentIndex.set(index);

          // Reset viewing details when changing testimonial
          if (this.isViewingDetails()) {
            this.isViewingDetails.set(false);
          }
        });
      });
    } catch (error) {
      console.error('Error navigating to testimonial:', error);
    }
  }

  /**
   * Move to the next slide in the specified swiper
   */
  nextSlide(swiperName: string) {
    if (swiperName === 'main' && this.mainContainer?.nativeElement?.swiper) {
      try {
        this.ngZone.runOutsideAngular(() => {
          this.mainContainer.nativeElement.swiper.slideNext();
        });
      } catch (error) {
        console.error('Error navigating to next slide:', error);
      }
    }
  }

  /**
   * Move to the previous slide in the specified swiper
   */
  prevSlide(swiperName: string) {
    if (swiperName === 'main' && this.mainContainer?.nativeElement?.swiper) {
      try {
        this.ngZone.runOutsideAngular(() => {
          this.mainContainer.nativeElement.swiper.slidePrev();
        });
      } catch (error) {
        console.error('Error navigating to previous slide:', error);
      }
    }
  }

  /**
   * Toggle details view
   */
  viewDetails() {
    this.isViewingDetails.set(true);
  }

  /**
   * Close the details view
   */
  closeDetails() {
    this.isViewingDetails.set(false);
  }

  /**
   * Open contact modal for scheduling a free trial
   */
  scheduleFreeTrial() {
    this.contactService.openModal();
  }

  /**
   * Handle page visibility changes to pause/resume autoplay
   */
  private handleVisibilityChanges() {
    document.addEventListener('visibilitychange', () => {
      if (!this.mainContainer?.nativeElement?.swiper) return;

      try {
        if (document.hidden) {
          this.mainContainer.nativeElement.swiper.autoplay.stop();
        } else {
          setTimeout(() => {
            this.mainContainer.nativeElement.swiper.autoplay.start();
          }, 300);
        }
      } catch (e) {}
    });

    this.destroy$.subscribe(() => {
      document.removeEventListener('visibilitychange', () => {});
    });
  }

  /**
   * Clean up swiper instances to prevent memory leaks
   */
  private cleanupSwipers() {
    try {
      if (this.mainContainer?.nativeElement?.swiper) {
        this.mainContainer.nativeElement.swiper.destroy();
      }

      if (this.thumbsContainer?.nativeElement?.swiper) {
        this.thumbsContainer.nativeElement.swiper.destroy();
      }
    } catch (error) {
      console.error('Error destroying swiper instances:', error);
    }
  }
}

