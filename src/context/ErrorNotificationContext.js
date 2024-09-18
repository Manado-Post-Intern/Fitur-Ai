import React, {createContext, useContext, useState} from 'react';

const ErrorNotificationContext = createContext();

export const ErrorNotificationProvider = ({children}) => {
  const [isErrorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = message => {
    setErrorMessage(message);
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000); // Sembunyikan setelah 3 detik
  };

  return (
    <ErrorNotificationContext.Provider
      value={{isErrorVisible, errorMessage, showError}}>
      {children}
    </ErrorNotificationContext.Provider>
  );
};

export const useErrorNotification = () => useContext(ErrorNotificationContext);
