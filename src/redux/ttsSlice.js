import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isPlayingMap: {}, // Stores the playing state per button ID
  isLoadingMap: {}, // Stores the loading state per button ID
};

const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    setPlaying: (state, action) => {
      const {id, value} = action.payload;
      state.isPlayingMap[id] = value; // Set the isPlaying state for a specific button
    },
    setLoading: (state, action) => {
      const {id, value} = action.payload;
      state.isLoadingMap[id] = value; // Set the isLoading state for a specific button
    },
  },
});

export const {setPlaying, setLoading} = ttsSlice.actions;
export default ttsSlice.reducer;
