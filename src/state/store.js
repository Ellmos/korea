import { configureStore } from "@reduxjs/toolkit";
import wordsSlice from "../actions/wordsSlice";

export const store = configureStore({
  reducer: {
    words: wordsSlice,
  },
});
