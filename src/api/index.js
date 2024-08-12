import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

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
