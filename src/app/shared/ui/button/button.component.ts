import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  buttonClick = output<MouseEvent>();


  buttonClasses = computed(() => {
    const baseClasses = 'px-6 py-3 font-medium rounded-lg transition-all duration-300';

    if (this.variant() === 'primary') {
      return `${baseClasses} bg-primary hover:bg-primary-dark border-2 border-primary text-white shadow-lg py-3 hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`;
    } else {
      return `${baseClasses} bg-transparent border-2 border-primary text-primary hover:bg-primary/10`;
    }
  });
  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.buttonClick.emit(event);
    }
  }
}
