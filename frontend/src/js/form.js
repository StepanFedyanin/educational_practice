import IMask from 'imask';
import { Fancybox } from '@fancyapps/ui';

export default class Form {
  static selector = {
    form: '#formContainer',
    input: '[data-form]',
    phoneMask: '[data-form=phone]'
  };

  constructor () {
    this.instance = document.querySelector(Form.selector.form);
    if (this.instance) {
      this.inputs = Array.from(this.instance.querySelectorAll(Form.selector.input));
      this.#phoneMask(this.instance.querySelector(Form.selector.phoneMask));
      this.inputs.forEach(input => this.inputsEvents(input));
      this.bindEvents();
    }
  }

  static setInputErrorState (input, isValid = false) {
    const errorContainer = input.parentNode.querySelector('#errorMessage');
    if (!input.value && errorContainer) {
      errorContainer.innerText = 'Заполните поле';
    } else if (isValid && errorContainer) {
      errorContainer.innerText = 'Не верно';
    }
    input.classList.toggle('isValid', isValid);
  }

  static isPhoneValid (input) {
    return input.value.length === 30;
  }

  static isNameValid (input) {
    return input.value.trim().length ? (/^[а-яА-Я]+$/).test(input.value) : true;
  }

  static isDefaultInputValid (input) {
    return !!input.value.trim().length;
  }

  static isValid (inputs = []) {
    const isInputValid = (input) => {
      const validationType = input.getAttribute('data-form');
      switch (validationType) {
        case 'phone':
          return Form.isPhoneValid(input);
        case 'name':
          return Form.isNameValid(input);
        case 'agreement':
          return input.checked;
        default:
          return Form.isDefaultInputValid(input);
      }
    };
    return inputs.map(el => {
      const isValid = isInputValid(el);
      Form.setInputErrorState(el, !isValid);
      return isValid;
    }).every(isValid => !!isValid);
  }

  static async send (data) {
    return await fetch('/#', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: JSON.stringify(data)
    });
  }

  #phoneMask (tel) {
    this.Imask = IMask(tel, {
      mask: '+{7} ( 0 0 0 ) 0 0 0 - 0 0 - 0 0'
    });
  }

  #onSubmit (e) {
    e.preventDefault();
    const isValid = Form.isValid(this.inputs);
    if (isValid) {
      this.#blockingBtn(true);
      Form.send(this.#dataAcquisition()).then((e) => {
        if (e.status === 200) {
          this.#popupForm('Отправка проведенна успешно');
          this.#dataCleaning(this.inputs);
        } else {
          throw new Error('');
        }
      }).catch(() => {
        this.#popupForm('Ошибка при отправке данных');
      }).finally(() => {
        this.#blockingBtn(false);
      });
    }
  }

  #dataAcquisition () {
    return this.inputs.reduce((target, current) => {
      if (current.type === 'checkbox') {
        target[current.dataset.form] = current.checked;
      } else {
        target[current.dataset.form] = current.value;
      }
      return target;
    }, {});
  }

  #dataCleaning (data) {
    data.forEach((item) => {
      if (item.type === 'checkbox') {
        item.checked = false;
      } else if (item.getAttribute('data-form') === 'phone') {
        this.Imask.value = '';
      } else {
        item.value = '';
      }
    });
  }

  #blockingBtn (disabledValue) {
    const sandBtn = this.instance.querySelector('#submitForm');
    if (sandBtn) {
      sandBtn.disabled = disabledValue;
    }
  }

  #popupForm (value) {
    const massage = document.querySelector('#formMessage');
    Fancybox.show([{ src: massage, type: 'inline' },], {
      closeButton: false,
      dragToClose: false,
      on: {
        initLayout: () => this.#messageForm(massage, value)
      }
    });
  }

  #messageForm (massage, massageText) {
    const formMessageText = massage.querySelector('#formMessageText');
    formMessageText.innerText = massageText;
  }

  inputsEvents (input) {
    input.addEventListener('click', (e) => e.currentTarget.classList.remove('isValid'));
  }

  bindEvents () {
    this.instance.addEventListener('submit', (e) => this.#onSubmit(e));
  }
}
