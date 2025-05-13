import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperThumpsTestimonialComponent } from './swiper-thumps-testimonial.component';

describe('SwiperThumpsTestimonialComponent', () => {
  let component: SwiperThumpsTestimonialComponent;
  let fixture: ComponentFixture<SwiperThumpsTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperThumpsTestimonialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperThumpsTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
