import {configureStore} from '@reduxjs/toolkit';
import ttsReducer from './ttsSlice'; // import ttsReducer from the newly created slice

export const store = configureStore({
  reducer: {
    tts: ttsReducer,
  },
});
