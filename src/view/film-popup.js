import Smart from './smart-view';
import dayjs from "dayjs";
import {EMOTIONS, EMOTION_PICS} from '../const.js';
import {CATEGORIES} from "../const.js";

const createFilmPopup = (data) => {
  const {title, originalTitle, raiting, date, duration, genre, poster, description, comments, director, writers, actors, country, age, userComment, chosenSmile, isInWatchlist, isInHistory, isFavourite} = data;

  const genres = genre.map((value, index) => {
    return `<span class="film-details__genre">${genre[index]}</span>`;
  }).join(``);

  const filmComments = comments.map((value, index) => {
    const {text, author, date: commentDate, emotion} = comments[index];

    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
  <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(commentDate).format(`YYYY/MM/DD HH:mm`)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }).join(``);

  const emojiRadio = EMOTIONS.map((value, index) => {
    const emotion = EMOTIONS[index];
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"${(emotion === chosenSmile) ? ` checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
  }).join(``);

  const smileImg = chosenSmile ? `<img src="${EMOTION_PICS[chosenSmile]}" width="55" height="55" alt="emoji-${chosenSmile}">` : ``;

  const commentValue = userComment || `Select reaction below and write comment here`;

  const getFilmStatusClass = (property) => {
    return property ? ` checked` : ``;
  };

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${raiting}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genres}
            </tr>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"${getFilmStatusClass(isInWatchlist)}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"${getFilmStatusClass(isInHistory)}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"${getFilmStatusClass(isFavourite)}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">${filmComments}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${smileImg}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="${commentValue}" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
          ${emojiRadio}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends Smart {
  constructor(film, cardUpdateHandler) {
    super();
    this._cardUpdateHandler = cardUpdateHandler;
    this._data = this._parseFilmTodata(film);
    this._crossClickHandler = this._crossClickHandler.bind(this);
    this._commentChangeHandler = this._commentChangeHandler.bind(this);
    this._emojiInputClickHandler = this._emojiInputClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._historyButtonClickHandler = this._historyButtonClickHandler.bind(this);
    this._favouritesButtonClickHandler = this._favouritesButtonClickHandler.bind(this);

    this._setHandlers();
  }

  getTemplate() {
    return createFilmPopup(this._data);
  }

  _parseFilmTodata(film) {
    return Object.assign(
        {},
        film,
        {
          userComment: ``,
          chosenSmile: ``,
          scroll: null
        }
    );
  }

  _parseDataToFilm(data) {
    data = Object.assign({}, data);
    delete data.userComment;
    delete data.chosenSmile;
    delete data.scroll;
    return data;
  }

  _crossClickHandler(evt) {
    evt.preventDefault();
    this._callback.crossClick(evt);
  }

  _commentChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({userComment: evt.target.value}, true);
  }

  _emojiInputClickHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._getScroll();
    this.updateData({chosenSmile: evt.target.value});
    this._scrollToY();
  }

  _watchlistButtonClickHandler() {
    this._cardUpdateHandler(CATEGORIES.WATCHLIST);
    this._data.isInWatchlist = !this._data.isInWatchlist;
  }

  _historyButtonClickHandler() {
    this._cardUpdateHandler(CATEGORIES.HISTORY);
    this._data.isInHistory = !this._data.isInHistory;
  }

  _favouritesButtonClickHandler() {
    this._cardUpdateHandler(CATEGORIES.FAVOURITES);
    this._data.isInFavourites = !this._data.isInFavourites;
  }

  setCrossClickHandler(cb) {
    this._callback.crossClick = cb;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._crossClickHandler);
  }

  _setHandlers() {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentChangeHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiInputClickHandler);
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._watchlistButtonClickHandler);
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._historyButtonClickHandler);
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, this._favouritesButtonClickHandler);
  }

  _restoreHandlers() {
    this._setHandlers();
    this.setCrossClickHandler(this._callback.crossClick);
  }

  _scrollToY() {
    this.getElement().scroll(0, this._scroll);
  }

  _getScroll() {
    this._scroll = this.getElement().scrollTop;
  }
}
