import { Component, inject } from '@angular/core';
import { ContactFormModalComponent } from "../../../../shared/ui/contact-modal/contact-modal.component";
import { ContactsService } from '../../../services/contacts.service';
import { CoursesComponent } from "../courses/courses.component";
import { AboutComponent } from "../about/about.component";
import { TestimonialsComponent } from "../../../../shared/ui/testimonials/testimonials.component";
import { SwiperThumpsTestimonialComponent } from "../swiper-thumps-testimonial/swiper-thumps-testimonial.component";
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-hero',
  imports: [ ContactFormModalComponent,CommonModule, CoursesComponent, AboutComponent, TestimonialsComponent, SwiperThumpsTestimonialComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class HeroComponent {

  contactService = inject(ContactsService);

  stats = [
    { value: '15,2K', label: 'Active students' },
    { value: '4,5K', label: 'Tutors' },
    { icon: 'resources', label: 'Resources' }
  ];
}
