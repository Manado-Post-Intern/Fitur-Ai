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
    resetAllTtsExcept: (state, action) => {
      const currentId = action.payload;
      console.log('Resetting all buttons except ID:', currentId);

      // Reset all except the button with the current id
      Object.keys(state.isPlayingMap).forEach(id => {
        if (id !== currentId) {
          console.log(`Resetting button with ID: ${id}`);
          state.isPlayingMap[id] = false;
          state.isLoadingMap[id] = false;
        }
      });
    },
  },
});

export const {setPlaying, setLoading, resetAllTtsExcept} = ttsSlice.actions;
export default ttsSlice.reducer;
