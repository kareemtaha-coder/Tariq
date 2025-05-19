import { Component, inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { ContactFormModalComponent } from "../../../../shared/ui/contact-modal/contact-modal.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ContactFormModalComponent, RouterLink, CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  contactService = inject(ContactsService);

  courses = [
    {
      id: 'quran',
      title: 'Quranic Tajweed & Memorization',
      category: 'Quran Studies',
      categoryColor: 'purple',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      features: [
        'Master proper Tajweed rules with expert guidance',
        'Comprehensive memorization techniques',
        'One-on-one sessions with certified teachers'
      ],
      rating: 4.9
    },
    {
      id: 'arabic',
      title: 'Modern Standard Arabic',
      category: 'Arabic Language',
      categoryColor: 'blue',
      image: 'https://images.unsplash.com/photo-1596568359553-a55bdb436d97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
      features: [
        'Develop reading, writing, and speaking skills',
        'Progressive learning from beginner to advanced',
        'Interactive conversation practice with natives'
      ],
      rating: 4.8
    },
    {
      id: 'islamic',
      title: 'Foundations of Faith',
      category: 'Islamic Studies',
      categoryColor: 'emerald',
      image: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      features: [
        'Explore Islamic history and traditions',
        'Understand fundamental principles and ethics',
        'Learn practical application in modern life'
      ],
      rating: 4.9
    }
  ];
}
