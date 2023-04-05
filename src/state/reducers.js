import { combineReducers } from "redux";
import { UPDATE_WORDS } from "../actions/wordsSlice";

const user = (user = { words: null }, action) => {
  switch (action.type) {
    case UPDATE_WORDS:
      return { words: action.words };
    default:
      return user;
  }
};

export default combineReducers({ user });
