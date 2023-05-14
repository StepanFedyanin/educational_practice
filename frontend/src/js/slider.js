import Swiper, { Navigation } from 'swiper';
import 'swiper/swiper.css';

export default class Slider {
  constructor (swiperContainer) {
    this.sliderContainer = swiperContainer;
    this.sliderLength = this.sliderContainer.querySelector('#slider_length');
    this.sliderSelect = this.sliderContainer.querySelector('#slider_select');
    if (this.sliderContainer) {
      this.init();
    }
  }

  init () {
    this.sliderElement = this.sliderContainer.querySelector('#swiper');
    const swiper = new Swiper(this.sliderElement, {
      modules: [Navigation,],
      allowTouchMove: false,
      navigation: {
        prevEl: this.sliderContainer.querySelector('.arrow_prev'),
        nextEl: this.sliderContainer.querySelector('.arrow_next')
      }
    });
    if (this.sliderLength) {
      this.sliderLength.innerHTML = swiper.slides.length < 10 ? '0' + swiper.slides.length : swiper.slides.length;
    }
    if (this.sliderSelect) {
      this.sliderSelect.innerHTML = swiper.activeIndex < 9 ? '0' + (swiper.activeIndex + 1) : swiper.activeIndex + 1;
      swiper.on('slideChange', () => {
        this.sliderSelect.innerHTML = swiper.activeIndex < 9 ? '0' + (swiper.activeIndex + 1) : swiper.activeIndex + 1;
      });
    }
  }
}
