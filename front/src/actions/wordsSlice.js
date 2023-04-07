import { createSlice } from "@reduxjs/toolkit";

const wordsSlice = createSlice({
  name: "words",
  initialState: null,
  reducers: {
    changeWords(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { changeWords } = wordsSlice.actions;
export default wordsSlice.reducer;
