import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export default class Modal {
  static selectors = {
    instance: '[data-popup]',
    btn: '#popup__btn',
    modalMinRange: '#modalMinRange',
    modalMaxRange: '#modalMaxRange',
    modalPoint: '#modalPoint'
  };

  constructor () {
    this.container = document.querySelector(Modal.selectors.instance);
    this.modalMinRange = this.container.querySelector(Modal.selectors.modalMinRange);
    this.modalMaxRange = this.container.querySelector(Modal.selectors.modalMaxRange);
    this.modalPoint = this.container.querySelector(Modal.selectors.modalPoint);
    if (this.container) {
      this.btn = this.container.querySelector(Modal.selectors.btn);
      this.bindEvents(this.btn);
    }
  }

  #handleClick (e) {
    e.preventDefault();
    if (e.currentTarget.dataset.src) {
      Fancybox.show([{ src: e.currentTarget.dataset.src, type: 'inline' },], {
        closeButton: false,
        dragToClose: false,
        on: {
          initLayout: () => this.#onModalShow()
        }
      });
    }
  }

  #onModalShow () {
    const rangeData = window.App.RangeSlider.getValues();
    const mapData = window.App.Map.getValue();
    this.modalMinRange.textContent = rangeData.minValue;
    this.modalMaxRange.textContent = rangeData.maxValue;
    this.modalPoint.textContent = mapData;
  }

  bindEvents (element) {
    element.addEventListener('click', (e) => this.#handleClick(e));
  }
}
