import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
// =================================== LOAD SESSION ===================================
export const loadSession = async () => {
  try {
    const detail = await EncryptedStorage.getItem('detail');
    if (detail !== null) {
      return JSON.parse(detail);
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// =================================== GPT ===================================
const openAI = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Config.OPENAI_API}`,
  },
});

let chatCounter = 0;

export const generateText = async prompt => {
  try {
    if (chatCounter >= 20) {
      return {
        text: 'Percakapan anda telah mencapai batas. Silahkan memulai ulang sesi chatnya',
        sources: [],
      };
    }
    const response = await openAI.post('/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `balas setiap pesan dengan bahasa indonesia, Berikan jawaban singkat, ringkas, dan padat, tidak lebih dari 2-3 kalimat. Gunakan bahasa Indonesia untuk balasan. Pertanyaannya: ${prompt}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    chatCounter += 1;

    return {
      text: response.data.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error generating text:', error);
    return {
      text: 'Maaf, ada masalah dalam menghasilkan jawaban.',
      sources: [],
    };
  }
};
export const resetChatCounter = () => {
  chatCounter = 0;
};

export const summarizetext = async cleanArticle => {
  const prompts = `dari berita ini saya mau kamu hanya bahas point penting dari beritanya saja, buat jadi bullet yang menjelaskan beritanya tanpa harus kamu bold point pentingnya, batasan bulletnya hanya 3 sampai 5 tergantun panjang beritanya saja, dan nanti panjang bulletin beritanya jadikan hanya 15 kata saja."${cleanArticle}"`;
  const response = await openAI.post('/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{role: 'user', content: prompts}],
    max_tokens: 500,
  });
  return response.data.choices[0].message.content;
};

export const textToSpeech = async article => {
  const response = await openAI.post('/audio/speech', {
    model: 'tts-1',
    voice: 'onyx',
    input: 'The quick brown fox jumped over the lazy dog.',
  });
  return response.data.audio;
};

// =================================== AUTH ===================================

const GRANT_TYPE = Config.GRANT_TYPE;
const API_KEY = Config.API_KEY;
const SECRET_KEY = Config.SECRET_KEY;
const API_URL = Config.API_URL;

export const auth = `${API_URL}oauth/token/`;
export const authData = {
  grant_type: GRANT_TYPE,
  api_key: API_KEY,
  secret_key: SECRET_KEY,
};
export const authConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.promedia+json; version=1.0',
  },
};

// =================================== HEADLINE ===================================

export const headline = `${API_URL}article/headline/`;

// =================================== READ ARTICLE ===================================

export const readArticle = `${API_URL}article/read/`;

// =================================== TRENDING / POPULAR ===================================

export const popular = `${API_URL}popular/`;

// =================================== EDITOR PICK ===================================

export const editorPick = `${API_URL}article/editor-pick/`;

// =================================== LATEST ===================================

export const latestEndPoint = `${API_URL}article/latest/`;

// =================================== REFERENCE SITE ===================================

export const site = `${API_URL}reference/site/`;

// =================================== TAG ARTICLE ===================================

export const tagArticle = `${API_URL}article/tag/`;

// =================================== SEARCH ===================================

export const search = `${API_URL}article/search/`;
