import FilterView from './view/filter-view.js';
import {render} from './framework/render';
import {generateFilter} from './mock/filter';
import {generateSorter} from './mock/sort';
import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/trip-model.js';
import { mockInit, tripPoints } from './mock/point.js';
const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');

const filters = generateFilter();
const sorters = generateSorter();
mockInit(5, 10);
const tripPointsModel = new TripPointModel(tripPoints);
const boardPresenter = new BoardPresenter({boardContainer: pageContainer, tripPointsModel, sorters});
render(new FilterView(filters), siteFilterElement);

boardPresenter.init();
