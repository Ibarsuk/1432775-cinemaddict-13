import UserIconView from './view/user-icon';
import SiteMenuView from './view/site-menu';
import SiteSortView from './view/site-sort';
import FilmsNumberView from './view/films-number';
import FilmCardView from './view/film-card';
import SiteCatalogView from './view/films-catalog';
import ShowMoreButtonView from './view/show-more-button';
import TopRaitedContainerView from './view/top-raited-container';
import MostCommentedContainerView from './view/most-commented-container';
import MockFilm from './mock/films';
import UserMock from './mock/user';
import {createFilmPopup} from './view/film-popup';
import {render} from './util.js';

const MOCK_FILMS = 15;
const FILMS_CARDS_NUMBER = 5;
const FILMS_STEP_LOAD = 5;
const FILMS_TOP_RAITED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
const AVAILABLE_FILMS = `123 456`;

const films = new Array(MOCK_FILMS).fill().map(() => {
  return new MockFilm().getNewFilm();
});
const user = new UserMock().userStats;

const siteHeader = document.querySelector(`.header`);
render(siteHeader, new UserIconView(user.avatar, user.raiting).getElement());

const siteMain = document.querySelector(`.main`);
const siteCatalog = new SiteCatalogView();
const filmsContainer = siteCatalog.getElement();
render(siteMain, new SiteMenuView(user).getElement(), `afterbegin`);
render(siteMain, new SiteSortView().getElement());
render(siteMain, filmsContainer);

const filmsListContainer = filmsContainer.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(FILMS_CARDS_NUMBER, films.length); i++) {
  render(filmsListContainer, new FilmCardView(films[i]).getElement());
}

if (films.length > Math.max(FILMS_STEP_LOAD, FILMS_CARDS_NUMBER)) {
  let renderedFilms = FILMS_CARDS_NUMBER;

  const onShowMoreButtonClick = () => {
    films.slice(renderedFilms, renderedFilms + FILMS_STEP_LOAD).forEach((film) => render(filmsListContainer, new FilmCardView(film).getElement()));

    renderedFilms += FILMS_STEP_LOAD;

    if (renderedFilms >= films.length) {
      showBoreButton.remove();
      showBoreButton.removeEventListener(`click`, onShowMoreButtonClick);
    }
  };

  const filmsCatalog = filmsContainer.querySelector(`.films-list`);
  render(filmsCatalog, new ShowMoreButtonView().getElement());

  const showBoreButton = filmsCatalog.querySelector(`.films-list__show-more`);
  showBoreButton.addEventListener(`click`, onShowMoreButtonClick);
}

render(filmsContainer, new TopRaitedContainerView().getElement());
render(filmsContainer, new MostCommentedContainerView().getElement());

const topRaitedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
const filmsSortedByRaiting = films.slice().sort((previous, current) => {
  return current.raiting - previous.raiting;
});
for (let i = 0; i < FILMS_TOP_RAITED_CARDS_NUMBER; i++) {
  render(topRaitedFilmsContainer, new FilmCardView(filmsSortedByRaiting[i]).getElement());
}

const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
for (let i = 0; i < FILMS_MOST_COMMENTED_CARDS_NUMBER; i++) {
  render(mostCommentedFilmsContainer, new FilmCardView(films.slice().sort((previous, current) => {
    return current.comments.length - previous.comments.length;
  })[i]).getElement());
}

const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);
render(footerStats, new FilmsNumberView(AVAILABLE_FILMS).getElement());

// const pageBody = document.querySelector(`body`);
// renderE(pageBody, `beforeend`, createFilmPopup(films[0]));
