import './styles/global.pcss';
import './styles/_fonts.pcss';
import './styles/pallette.pcss';
import './styles/rangeSlider.pcss';
import './styles/slider.pcss';
import './styles/map.pcss';
import './styles/popup.pcss';
import './styles/form.pcss';
import './styles/UI.pcss';
import RangeSlider from './js/rangeSlider';
import Slider from './js/slider';
import YandexAPI from './js/map';
import Modal from './js/modal';
import Form from './js/form';

const rangeSliderElement = document.getElementById('rangeSlider');
window.App = {
  RangeSlider: new RangeSlider(rangeSliderElement, { range: [0, 100,], start: [0, 100,] }),
  Map: new YandexAPI()
};

const sliderContainer = document.querySelector('.slider__content');
// eslint-disable-next-line no-unused-vars
const defaultSl = new Slider(sliderContainer);

const modal = new Modal();

const form = new Form();
