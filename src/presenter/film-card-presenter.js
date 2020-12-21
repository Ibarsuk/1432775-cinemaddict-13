import {render, replace, remove, isKeyPressed} from '../util.js';
import FilmCardView from '../view/film-card';
import FilmPopupView from '../view/film-popup';
import {CATEGORIES, UserAction, ModelMethod} from "../const.js";
import CommentPresenter from './comment-presenter';
import {generateId} from '../mock/const';

export default class CardPresenter {
  constructor(commentsModel, filmChangeCb, closePopupsCb) {
    this._commentsModel = commentsModel;

    this._commentPresenters = {};

    this._closePopups = closePopupsCb;

    this._card = null;
    this._filmChange = filmChangeCb;
    this._closePopups = closePopupsCb;
    this._pageBody = document.querySelector(`body`);
    this._popup = null;

    this.closePopup = this.closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);
    this._onCardPosterClick = this._onCardPosterClick.bind(this);
    this._onCardTitleClick = this._onCardTitleClick.bind(this);
    this._onCardCommentsClick = this._onCardCommentsClick.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._onPopupCrossClick = this._onPopupCrossClick.bind(this);
    this._onCardWatchlistClick = this._onCardWatchlistClick.bind(this);
    this._onCardToHistoryClick = this._onCardToHistoryClick.bind(this);
    this._onCardFavouritesClick = this._onCardFavouritesClick.bind(this);
    this.cardUpdateHandler = this.cardUpdateHandler.bind(this);
    this.onCommentDelete = this.onCommentDelete.bind(this);
    this.onViewAction = this.onViewAction.bind(this);
    this._onCommentAdd = this._onCommentAdd.bind(this);
    this._renderCommentsToPopup = this._renderCommentsToPopup.bind(this);
    this.addComment = this.addComment.bind(this);

    this._commentsModel.addObserver(ModelMethod.DELETE_COMMENT, this.onCommentDelete);
    this._commentsModel.addObserver(ModelMethod.ADD_COMMENT, this.addComment);
  }

  init(film, container = this._container) {
    this._film = film;
    this._container = container;

    const prevFilmCardView = this._card;

    this._card = new FilmCardView(this._film);

    this._card.setPosterClickHandler(this._onCardPosterClick);
    this._card.setTitleClickHandler(this._onCardTitleClick);
    this._card.setCommentsClickHandler(this._onCardCommentsClick);
    this._card.setToWatchListButtonClickHandler(this._onCardWatchlistClick);
    this._card.setWatchedButtonClickHandler(this._onCardToHistoryClick);
    this._card.setToFavouritesButtonClickHandler(this._onCardFavouritesClick);

    if (prevFilmCardView === null) {
      render(this._container, this._card);
      return;
    }

    if (this._container.contains(prevFilmCardView.getElement())) {
      replace(this._card, prevFilmCardView);
    }

    remove(prevFilmCardView);
  }

  destroy() {
    remove(this._card);
  }

  onViewAction(eventType, update) {
    switch (eventType) {
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(update);
        break;
    }
  }

  onCommentDelete(deletedComment) {
    if (this._commentPresenters[deletedComment.id]) {
      this._commentPresenters[deletedComment.id].destroy();
      delete this._commentPresenters[deletedComment.id];

      this._popup.changeComment(Object.keys(this._commentPresenters));
      Object.values(this._commentPresenters).forEach((commentPresenter) => commentPresenter.init(this._popup.getElement().querySelector(`.film-details__comments-list`)));

      this._popup.scrollToY();

      this._filmChange(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
          {},
          this._film,
          {
            comments: Object.keys(this._commentPresenters)
          }
      ));
    }
  }

  _onCommentAdd(evt) {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      if (this._popup.getNewCommentData() === null) {
        return;
      }
      const comment = Object.assign({},
          this._popup.getNewCommentData(),
          {
            id: generateId(),
            date: new Date(),
            author: `local user`
          });
      this._popup.clearInput();
      this.onViewAction(UserAction.ADD_COMMENT, comment);
    }
  }

  addComment(comment) {
    if (this._popup) {

      const commentPresenter = new CommentPresenter(this.onViewAction, comment);
      this._commentPresenters[comment.id] = commentPresenter;

      this._popup.changeComment(Object.keys(this._commentPresenters));

      this._renderCommentsToPopup();
      commentPresenter.init(this._popup.getElement().querySelector(`.film-details__comments-list`));

      this._popup.scrollToY();


      this._filmChange(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
          {},
          this._film,
          {
            comments: Object.keys(this._commentPresenters)
          }
      ));

    }
  }

  _renderCommentsToPopup() {
    const comments = this._commentsModel.getComments();

    this._film.comments.forEach((commentId) => {
      const comment = comments.find((recievedComment) => (String(recievedComment.id) === String(commentId)));

      const commentPresenter = new CommentPresenter(this.onViewAction, comment);
      commentPresenter.init(this._popup.getElement().querySelector(`.film-details__comments-list`));
      this._commentPresenters[comment.id] = commentPresenter;
    });
  }


  closePopup() {
    if (this._popup) {
      remove(this._popup);
      document.removeEventListener(`keydown`, this._onCommentAdd);
      document.removeEventListener(`keyup`, this._onPopupEscPress);
      this._pageBody.classList.remove(`hide-overflow`);

      Object.values(this._commentPresenters).forEach((presenter) => {
        presenter.destroy();
      });

      this._commentPresenters = {};
    }
  }

  _openPopup(evt) {
    evt.preventDefault();
    this._closePopups();
    this._popup = new FilmPopupView(this._film, this.cardUpdateHandler, this._renderCommentsToPopup);

    this._renderCommentsToPopup();

    render(this._pageBody, this._popup);
    this._popup.setCrossClickHandler(this._onPopupCrossClick);
    document.addEventListener(`keydown`, this._onCommentAdd);
    document.addEventListener(`keyup`, this._onPopupEscPress);
    this._pageBody.classList.add(`hide-overflow`);
  }

  _onCardWatchlistClick() {
    this._filmChange(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
        {},
        this._film,
        {
          isInWatchlist: !this._film.isInWatchlist
        }
    ));
  }

  _onCardFavouritesClick() {
    this._filmChange(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
        {},
        this._film,
        {
          isFavourite: !this._film.isFavourite
        }
    ));
  }

  _onCardToHistoryClick() {
    this._filmChange(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
        {},
        this._film,
        {
          isInHistory: !this._film.isInHistory
        }
    ));
  }

  cardUpdateHandler(category) {
    switch (category) {
      case CATEGORIES.WATCHLIST:
        this._onCardWatchlistClick();
        break;
      case CATEGORIES.HISTORY:
        this._onCardToHistoryClick();
        break;
      case CATEGORIES.FAVOURITES:
        this._onCardFavouritesClick();
        break;
    }
  }

  _onCardPosterClick(evt) {
    this._openPopup(evt);
  }

  _onCardTitleClick(evt) {
    this._openPopup(evt);
  }

  _onCardCommentsClick(evt) {
    this._openPopup(evt);
  }

  _onPopupEscPress(evt) {
    isKeyPressed(evt, this.closePopup, `Escape`);
  }

  _onPopupCrossClick() {
    this.closePopup();
  }
}
