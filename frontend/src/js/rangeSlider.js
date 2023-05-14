import noUiSlider from 'nouislider';

export default class RangeSlider {
  constructor (rangeSlider, params = { range: [0, 100,], start: [0, 100,] }) {
    this.rangeParams = {
      min: params.range[0],
      max: params.range[1]
    };
    this.valueStart = params.start;
    this.sliderElement = rangeSlider;
    if (this.sliderElement) {
      this.UISlider = noUiSlider.create(this.sliderElement, {
        start: this.valueStart,
        connect: true,
        range: this.rangeParams,
        step: 1,
        tooltips: [
          {
            to: function (value) {
              return `от ${value} $`;
            }
          },
          {
            to: function (value) {
              return `до ${value} $`;
            }
          },]
      });
    }
  }

  getValues () {
    const valueArray = this.UISlider.get(true);
    return {
      minValue: Math.min.apply(null, valueArray),
      maxValue: Math.max.apply(null, valueArray)
    };
  }
}
