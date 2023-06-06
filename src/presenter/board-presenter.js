import SortView from '../view/sort-view';
import PointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';
import CreateFormView from '../view/form-creator-view';
import NoPointsView from '../view/no-view';
import { render } from '../render';
import { isEscapeKey } from '../util';

export default class BoardPresenter {
  #boardContainer = null;
  #tripPointsModel = null;
  #eventListComponent = null;
  #tripPoints = null;

  constructor({boardContainer, tripPointsModel}) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
  }

  init() {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    if (this.#tripPoints.length === 0) {
      render(new NoPointsView(), this.#boardContainer);
    } else {
      this.#eventListComponent = new PointListView();
      render(new SortView(), this.#boardContainer);
      render(this.#eventListComponent, this.#boardContainer);
      render(new CreateFormView(this.#tripPoints[0]), this.#eventListComponent.element);
      for (let i = 1; i < this.#tripPoints.length - 1; i++) {
        this.#renderTripPoint(this.#tripPoints[i]);
      }
    }
  }

  #renderTripPoint(tripPoint) {
    const tripPointComponent = new PointView({tripPoint});
    const editFormComponent = new PointEditorView(tripPoint);

    const replacePointToForm = () => {
      this.#eventListComponent.element.replaceChild(editFormComponent.element, tripPointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#eventListComponent.element.replaceChild(tripPointComponent.element, editFormComponent.element);
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.body.addEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    editFormComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    editFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    function closeEditFormOnEcsapeKey(evt) {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
      }
    }
    render(tripPointComponent, this.#eventListComponent.element);
  }
}
