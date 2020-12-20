export const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

export const EMOTION_PICS = {
  smile: `./images/emoji/smile.png`,
  sleeping: `./images/emoji/sleeping.png`,
  puke: `./images/emoji/puke.png`,
  angry: `./images/emoji/angry.png`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RAITING: `raiting`,
  COMMENTS: `comments`
};

export const CATEGORIES = {
  All: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVOURITES: `favourites`
};

export const UserAction = {
  DELETE_COMMENT: `DELETE_COMMENT`,
  ADD_COMMENT: `ADD_COMMENT`,
  UPDATE_FILM_CATEGORY: `UPDATE_FILM_CATEGORY`,
  UPDATE_FILTER: `UPDATE_FILTER`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const ModelMethod = {
  UPDATE_FILM: `updateFilm`,
  UPDATE_FILTER: `updateFilter`,
  ADD_COMMENT: `addComment`,
  DELETE_COMMENT: `deleteComment`
};
