import { Component, inject } from '@angular/core';
import { ContactFormModalComponent } from "../../../../shared/ui/contact-modal/contact-modal.component";
import { ContactsService } from '../../../services/contacts.service';
import { CoursesComponent } from "../courses/courses.component";
import { AboutComponent } from "../about/about.component";
import { TestimonialsComponent } from "../../../../shared/ui/testimonials/testimonials.component";
import { SwiperThumpsTestimonialComponent } from "../swiper-thumps-testimonial/swiper-thumps-testimonial.component";

@Component({
  selector: 'app-hero',
  imports: [ ContactFormModalComponent, CoursesComponent, AboutComponent, TestimonialsComponent, SwiperThumpsTestimonialComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  contactService = inject(ContactsService);


}
