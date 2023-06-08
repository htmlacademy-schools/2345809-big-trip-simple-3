import FilterView from './view/filter-view.js';
import {render} from './framework/render';
import {generateFilter} from './mock/filter';
import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/trip-model.js';
import { mockInit, tripPoints } from './mock/point.js';
import ModelOffers from './model/offer-model';
import ModelDestinations from './model/destin-model';
import {offersByType} from './mock/const';
import {destinations} from './mock/destin';
const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');

const filters = generateFilter();

mockInit(5, 10);
const tripPointsModel = new TripPointModel(tripPoints);
const modelOffers = new ModelOffers(offersByType);
const modelDestinations = new ModelDestinations(destinations);
const boardPresenter = new BoardPresenter({
  boardContainer: pageContainer,
  tripPointsModel: tripPointsModel,
  modelOffers: modelOffers,
  modelDestinations: modelDestinations
});
render(new FilterView(filters), siteFilterElement);

boardPresenter.init();
