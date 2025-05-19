import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { Testimonial } from '../../../Core/models/testimonial.model';
import { CommonModule } from '@angular/common';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestimonialsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('featuredSwiperEl', { static: false })
  featuredSwiperEl!: ElementRef<SwiperContainer>;

  isMobile: boolean = false;
  isAnimating: boolean = false;
  resizeObserver: ResizeObserver | null = null;
  isInitialized: boolean = false;

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sara Ahmed',
      role: 'Quran Student',
      avatar: '/1.jpg',
      content: '"Tabiiyn Institute has been a blessing in my journey to learn Quran. The teachers are incredibly knowledgeable and patient. I\'ve improved my recitation tremendously in just a few months."',
      rating: 5
    },
    {
      id: 2,
      name: 'Mohamed Ali',
      role: 'Parent',
      avatar: '/2.jpg',
      content: '"My children look forward to their Quran lessons every week. The interactive teaching methods make learning enjoyable while maintaining respect for the sacred text. Highly recommended!"',
      rating: 4
    },
    {
      id: 3,
      name: 'Laila Hassan',
      role: 'Tajweed Student',
      avatar: '/3.jpg',
      content: '"The tajweed course at Tabiiyn is exceptional. The instructors focus on proper pronunciation and rules, providing personalized feedback that has drastically improved my recitation quality."',
      rating: 5
    },
    {
      id: 4,
      name: 'Ahmed Mahmoud',
      role: 'Arabic Student',
      avatar: '/4.jpg',
      content: '"Learning Arabic through Tabiiyn has been transformative. The curriculum is structured yet flexible, and the teachers make complex grammar concepts accessible and practical."',
      rating: 5
    },
    {
      id: 5,
      name: 'Nour Ibrahim',
      role: 'Hifz Student',
      avatar: '/5.jpg',
      content: '"The memorization program at Tabiiyn strikes the perfect balance between discipline and encouragement. Their unique revision techniques have helped me retain what I\'ve memorized."',
      rating: 4
    },
  ];

  constructor(private ngZone: NgZone) {}

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
    this.reinitSwiperIfNeeded();
  }

  ngOnInit() {
    this.checkIfMobile();
  }

  ngAfterViewInit(): void {
    // Initialize featured swiper with options
    setTimeout(() => {
      this.initSwiper();
      this.setupResizeObserver();
      this.initAnimations();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Initialize the swiper component with proper parameters
   */
  private initSwiper(): void {
    if (this.featuredSwiperEl && !this.isInitialized) {
      try {
        const featuredSwiperElement = this.featuredSwiperEl.nativeElement;

        // Adjust options based on device
        const slidesPerViewValue = this.isMobile ? 1 : 'auto';

        // Set additional parameters with TypeScript
        const swiperParams = {
          slidesPerView: slidesPerViewValue,
          centeredSlides: true,
          loop: true,
          effect: 'coverflow',
          grabCursor: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          coverflowEffect: {
            rotate: this.isMobile ? 2 : 5,
            stretch: 0,
            depth: this.isMobile ? 50 : 100,
            modifier: 1,
            slideShadows: false,
          },
          breakpoints: {
            320: {
              slidesPerView: 1,
              coverflowEffect: {
                rotate: 2,
                depth: 50
              }
            },
            640: {
              slidesPerView: 'auto',
              coverflowEffect: {
                rotate: 3,
                depth: 70
              }
            },
            1024: {
              slidesPerView: 'auto',
              coverflowEffect: {
                rotate: 5,
                depth: 100
              }
            }
          },
          on: {
            init: () => {
              this.isInitialized = true;
            }
          }
        };

        // Initialize with parameters
        Object.assign(featuredSwiperElement, swiperParams);

        this.ngZone.runOutsideAngular(() => {
          featuredSwiperElement.initialize();
        });
      } catch (error) {
        console.error('Error initializing swiper:', error);
      }
    }
  }

  /**
   * Setup a resize observer to handle layout changes
   */
  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined' && this.featuredSwiperEl) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.ngZone.run(() => {
          this.reinitSwiperIfNeeded();
        });
      });

      this.resizeObserver.observe(this.featuredSwiperEl.nativeElement);
    }
  }

  /**
   * Reinitialize swiper if needed based on layout changes
   */
  private reinitSwiperIfNeeded(): void {
    if (this.featuredSwiperEl && this.isInitialized) {
      try {
        const swiper = this.featuredSwiperEl.nativeElement.swiper;
        if (swiper) {
          swiper.update();
        }
      } catch (error) {
        console.error('Error updating swiper:', error);
      }
    }
  }

  /**
   * Move to the next slide in the specified swiper
   */
  nextSlide(swiperId: string): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (swiperId === 'featured' && this.featuredSwiperEl) {
      try {
        this.ngZone.runOutsideAngular(() => {
          this.featuredSwiperEl.nativeElement.swiper.slideNext();
        });
      } catch (error) {
        console.error('Error navigating to next slide:', error);
      }
    }

    // Prevent rapid clicking
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  /**
   * Move to the previous slide in the specified swiper
   */
  prevSlide(swiperId: string): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (swiperId === 'featured' && this.featuredSwiperEl) {
      try {
        this.ngZone.runOutsideAngular(() => {
          this.featuredSwiperEl.nativeElement.swiper.slidePrev();
        });
      } catch (error) {
        console.error('Error navigating to previous slide:', error);
      }
    }

    // Prevent rapid clicking
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  /**
   * Get a testimonial for the grid display
   * Ensures we don't run out of testimonials if there are less than 3
   */
  getGridTestimonial(index: number): Testimonial {
    // If we have enough testimonials, return them sequentially
    if (index < this.testimonials.length) {
      return this.testimonials[index];
    }

    // Otherwise, cycle back to the beginning
    return this.testimonials[index % this.testimonials.length];
  }

  /**
   * Initialize animations with staggered delays
   */
  private initAnimations(): void {
    // Add animation classes with appropriate delay
    setTimeout(() => {
      try {
        const cards = document.querySelectorAll('.testimonial-card');
        cards.forEach((card, index) => {
          (card as HTMLElement).style.animationDelay = `${index * 0.15}s`;
        });
      } catch (error) {
        console.error('Error initializing animations:', error);
      }
    }, 100);
  }

  /**
   * Check if we're on mobile and update state
   */
  private checkIfMobile(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // If mobile state changed, we should reinitialize
    if (wasMobile !== this.isMobile && this.isInitialized) {
      this.isInitialized = false;
      setTimeout(() => {
        this.initSwiper();
      }, 50);
    }
  }
}
