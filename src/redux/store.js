import {configureStore} from '@reduxjs/toolkit';
import ttsReducer from './ttsSlice';

export const store = configureStore({
  reducer: {
    tts: ttsReducer,
  },
});
