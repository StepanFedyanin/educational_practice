export class YandexMap {
  constructor (element) {
    this.element = element;
    this.params = JSON.parse(this.element.dataset.params);
    this.coordsValue = this.params.center;
    this.map = new ymaps.Map(this.element, {
      center: this.params.center.split(','),
      zoom: 11
    });
    this.mapObjects = [];
    this.params.points.forEach((point) => {
      this.mapObjects.push(this.createMapObject(point));
    });
    this.clusterer = new ymaps.Clusterer();
    this.clusterer.add(this.mapObjects);
    this.map.geoObjects.add(this.clusterer);
  }

  createMapObject (params) {
    if (params) {
      const mapObject = new ymaps.Placemark(params.coords.split(','), {}, {
        iconImageHref: params.url,
        iconImageSize: [30, 42,],
        iconImageOffset: [-3, -42,]
      });
      mapObject.events
        .add('click', (e) => {
          e.get('target').options.set('iconImageHref', params.url_active);
          this.#mapPointsEvent(params);
          this.coordsValue = params.coords;
        })
        .add('mouseenter', (e) => {
          e.get('target').options.set('iconImageHref', params.url_active);
        })
        .add('mouseleave', (e) => {
          if (this.coordsValue !== params.coords) {
            e.get('target').options.set('iconImageHref', params.url);
          }
        });
      return mapObject;
    }
  }

  #mapPointsEvent (params) {
    this.mapObjects.forEach((geoObject) => {
      if (geoObject.geometry._coordinates.join('') === params.coords.split(',').join('')) {
        const geoObjectData = this.params.points.find((item) => item.coords.split(',').join('') === geoObject.geometry._coordinates.join(''));
        geoObject.options.set('iconImageHref', geoObjectData.url_active);
      } else {
        const geoObjectData = this.params.points.find((item) => item.coords.split(',').join('') === geoObject.geometry._coordinates.join(''));
        geoObject.options.set('iconImageHref', geoObjectData.url);
      }
    });
  }
}

export default class YandexAPI {
  static selector = '#yandexMap';

  static url = 'https://api-maps.yandex.ru/2.0/?apikey=ff48fcf3-6e41-465e-808e-30baac211292&load=package.full&lang=ru_RU&onload=initMaps';

  constructor () {
    this.maps = document.querySelectorAll(YandexAPI.selector);
    if (this.maps.length) {
      window.initMaps = this.init.bind(this); // onload callback для YandexAPI.url
      this.load()
        .then(() => {
          console.debug('Yandex Maps API готово к использованию');
        })
        .catch(() => {
          console.debug('Произошла ошибка загрузки Yandex Maps API');
        });
    }
  }

  async load () {
    const script = document.createElement('script');
    script.src = YandexAPI.url;
    document.currentScript.parentNode.insertBefore(
      script,
      document.currentScript
    );
  }

  init () {
    Array.from(this.maps).forEach((map) => {
      this.yandexMap = new YandexMap(map);
    });
  }

  getValue () {
    return this.yandexMap.coordsValue;
  }
}
