import axios from 'axios';
import {createContext, useEffect, useState} from 'react';
import {auth as promediaAuth, authConfig, authData} from '../api';

export const TokenContext = createContext();

export const TokenProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const fetchToken = async () => {
    try {
      console.log('Fetching token....');
      const response = await axios.post(promediaAuth, authData, authConfig);
      console.log('Token response:', response.data);
      const session = response.data.data.detail;
      setToken(session.access_token);
      return session.access_token;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  useEffect(() => {
    const getToken = async () => {
      await fetchToken();
    };
    getToken();
  }, []);

  axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response && error.response.status === 403) {
        console.log('Received 403 error, fetching new token...');
        const newToken = await fetchToken();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios(error.config);
        }
      }
      return Promise.reject(error);
    },
  );

  return (
    <TokenContext.Provider value={{token}}>{children}</TokenContext.Provider>
  );
};
