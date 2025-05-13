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
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { ContactsService } from '../../../services/contacts.service';

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
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperThumpsTestimonialComponent implements OnInit, AfterViewInit, OnDestroy {

    contactService = inject(ContactsService);

  // Signal-based reactive state
  currentIndex = signal(0);
  isViewingDetails = signal(false);

  // ViewChild references for swiper containers
  @ViewChild('thumbsContainer', { static: true })
  thumbsContainer!: ElementRef<SwiperContainer>;

  @ViewChild('mainContainer', { static: true })
  mainContainer!: ElementRef<SwiperContainer>;

  // Manage component lifecycle with RxJS
  private destroy$ = new Subject<void>();

  // Testimonials data
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
      shortQuote: 'Highly recommended teacher',
      mainQuote: 'Patient and explains concepts so clearly. I never thought I could progress this fast in my studies.',
      course: 'Arabic Language Basics',
      rating: '4.9'
    },
    {
      name: 'Joanna Ali',
      avatar: '/4.jpg',
      image: '/4.jpg',
      shortQuote: 'Amazing teaching style',
      mainQuote: 'Makes learning interactive and enjoyable. The curriculum is well-structured and each lesson builds perfectly on the previous one.',
      course: 'Interactive Quran Learning',
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
    // Listen for window resize events to reinitialize swiper if needed
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSwiperOnResize();
      });
  }

  ngAfterViewInit() {
    // Initialize swipers with enhanced configuration
    this.initializeSwipers();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Updates swiper instances on window resize
   */
  private updateSwiperOnResize() {
    if (this.mainContainer?.nativeElement?.swiper &&
        this.thumbsContainer?.nativeElement?.swiper) {
      this.mainContainer.nativeElement.swiper.update();
      this.thumbsContainer.nativeElement.swiper.update();
    }
  }

  /**
   * Initialize both swiper instances with optimized configuration
   */
  private initializeSwipers() {
    // Configure main swiper parameters
    const mainSwiperParams = {
      slidesPerView: 1,
      spaceBetween: 10,
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
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
      on: {
        slideChange: (swiper: any) => {
          // Update the current index using signal
          this.currentIndex.set(swiper.realIndex);
        }
      },
    };

    // Configure thumbs swiper parameters optimized for mobile
    const thumbsSwiperParams = {
      slidesPerView: 4,
      spaceBetween: 10,
      watchSlidesProgress: true,
      centerInsufficientSlides: true,
      slideToClickedSlide: true,
      loop: true,
      breakpoints: {
        320: {
          slidesPerView: 3.5,
          spaceBetween: 8,
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        1024: {
          // slidesPerView: 5,
          spaceBetween: 12,
        },
      },
      on: {
        click: (swiper: any) => {
          const clickedIndex = swiper.clickedIndex;
          if (clickedIndex !== undefined) {
            this.mainContainer.nativeElement.swiper.slideToLoop(swiper.realIndex);
            this.currentIndex.set(swiper.realIndex);
          }
        },
      },
    };

    // Apply configurations
    const main = this.mainContainer.nativeElement;
    const thumbs = this.thumbsContainer.nativeElement;

    Object.assign(main, mainSwiperParams);
    Object.assign(thumbs, thumbsSwiperParams);

    // Initialize swipers in proper order
    thumbs.initialize();
    main.initialize();

    // Add additional event listeners for better UX
    main.addEventListener('mouseenter', () => {
      if (main.swiper.autoplay.running) {
        main.swiper.autoplay.stop();
      }
    });

    main.addEventListener('mouseleave', () => {
      if (!main.swiper.autoplay.running) {
        main.swiper.autoplay.start();
      }
    });

    // Add touch event listeners for mobile
    main.addEventListener('touchstart', () => {
      if (main.swiper.autoplay.running) {
        main.swiper.autoplay.stop();
      }
    }, { passive: true });

    main.addEventListener('touchend', () => {
      if (!main.swiper.autoplay.running) {
        main.swiper.autoplay.start();
      }
    }, { passive: true });
  }

  /**
   * View details of a specific testimonial
   */
  viewTestimonialDetails(index: number) {
    this.mainContainer.nativeElement.swiper.slideToLoop(index);
    this.currentIndex.set(index);
    this.isViewingDetails.set(true);
  }

  /**
   * Close details view
   */
  closeDetails() {
    this.isViewingDetails.set(false);
  }

  /**
   * Navigate to a specific testimonial
   */
  goToTestimonial(index: number) {
    this.mainContainer.nativeElement.swiper.slideToLoop(index);
  }

  /**
   * Schedule a free trial lesson
   */
  scheduleFreeTrial() {
    console.log('Scheduling free trial');
    // Navigate to booking page implementation
  }
}

