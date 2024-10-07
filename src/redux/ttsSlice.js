import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
  // cleanArticle: '',
  isLoading: false,
};

const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    // setCleanArticle: (state, action) => {
    //   state.cleanArticle = action.payload;
    // },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setPlaying, setCleanArticle, setLoading} = ttsSlice.actions;
export default ttsSlice.reducer;
