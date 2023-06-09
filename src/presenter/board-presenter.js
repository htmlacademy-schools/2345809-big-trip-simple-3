import SortView from '../view/sort-view';
import PointListView from '../view/point-list-view';
import NoPointsView from '../view/no-view';
import {render, RenderPosition, remove} from '../framework/render';
import PointPresenter from '../presenter/point-presenter';
import {FilterType, SortType, UpdateType, UserAction} from '../const';
import {sorts} from '../sort';
import {filter} from '../util';
import NewPointPresenter from './new-presenter';
import LoadingView from '../view/load-view';

export default class BoardPresenter {
  #noPoints = null;
  #sort = null;
  #pointPresenter = new Map();

  #boardContainer = null;
  #tripPointsModel = null;

  #pointsList = new PointListView();
  #modelOffers = null;
  #modelDestinations = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #loadingComponent = new LoadingView();
  #isLoading = true;

  #modelFilter = null;
  #newPointPresenter = null;

  constructor({boardContainer, tripPointsModel, modelOffers, modelDestinations, modelFilter, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
    this.#modelOffers = modelOffers;
    this.#modelDestinations = modelDestinations;
    this.#modelFilter = modelFilter;
    this.#newPointPresenter = new NewPointPresenter({

      pointListContainer: this.#pointsList.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#modelFilter.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#modelFilter.filter;
    const points = this.#tripPointsModel.tripPoints.sort(sorts[SortType.TIME]);
    const filteredPoints = filter[this.#filterType](points);
    return (sorts[this.#currentSortType]) ? filteredPoints.sort(sorts[this.#currentSortType]) : filteredPoints;

  }

  get destinations() {
    return this.#modelDestinations.destinations;
  }

  get offers() {
    return this.#modelOffers.offers;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#modelFilter.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.destinations, this.offers);
  }

  #renderNoPoint() {
    this.#noPoints = new NoPointsView({
      filterType: this.#filterType
    });
    render(this.#noPoints, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sort = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sort, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderHandleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointList: this.#pointsList.element,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#renderHandleModeChange,
    });
    pointPresenter.init(point, this.destinations, this.offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const points = this.points;
    if (points.length === 0) {
      this.#renderNoPoint();
      return;
    }
    this.#renderSort();

    render(this.#pointsList, this.#boardContainer);
    this.#renderPointsList(points);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#tripPointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #clearBoard(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.delete());
    this.#pointPresenter.clear();

    remove(this.#sort);
    remove(this.#loadingComponent);

    if (this.#noPoints) {
      remove(this.#noPoints);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
