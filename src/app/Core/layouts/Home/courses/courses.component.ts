import { Component, inject } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { ContactFormModalComponent } from "../../../../shared/ui/contact-modal/contact-modal.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [ContactFormModalComponent,RouterLink],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
contactService = inject(ContactsService)
}
