// articleReducer.js

const initialState = {
  activeTTSArticle: null, // Artikel yang sedang dibacakan TTS
  isLoading: false, // Status loading
  // State lain terkait artikel
};

const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_TTS':
      return {
        ...state,
        activeTTSArticle: action.payload, // Simpan ID artikel yang sedang dibacakan
        isLoading: true, // Mulai loading
      };
    case 'STOP_TTS':
      return {
        ...state,
        activeTTSArticle: null, // Hentikan TTS
        isLoading: false, // Reset loading
      };
    default:
      return state;
  }
};
// actions.js

export const startTTS = articleId => {
  return {
    type: 'START_TTS',
    payload: articleId, // Artikel yang sedang dibacakan
  };
};

export const stopTTS = () => {
  return {
    type: 'STOP_TTS',
  };
};
