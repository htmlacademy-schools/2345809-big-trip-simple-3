import {UpdateType} from '../const';
import Observable from '../framework/observable';
export default class TripPointModel extends Observable {
  #tripPoints = [];
  #pointsApiService = null;
  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get tripPoints() {
    return this.#tripPoints;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#tripPoints = points.map(this.#adaptToClient);
    } catch(err) {
      this.#tripPoints = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {

    const index = this.#tripPoints.findIndex((point) => point.id === update.id);

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#tripPoints = [
        ...this.#tripPoints.slice(0, index),
        updatedPoint,
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint(updateType, update) {
    this.#tripPoints = [
      update,
      ...this.#tripPoints
    ];

    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#tripPoints.findIndex((point) => point.id === update.id);

    this.#tripPoints = [
      ...this.#tripPoints.slice(0, index),
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      offersIDs: point['offers'],
      basePrice: point['base_price'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['offers'];

    return adaptedPoint;
  }
}
