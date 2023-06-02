import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';
import NewItemFormView from '../view/form-creator-view';
import { render } from '../render';

export default class BoardPresenter {
  eventListComponent = new PointsListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.eventListComponent, this.boardContainer);

    render(new NewItemFormView(), this.eventListComponent.getElement());
    render(new PointView(), this.eventListComponent.getElement());
    render(new PointEditorView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
