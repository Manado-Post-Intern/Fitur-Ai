import {createContext, useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import moment from 'moment/moment';

export const AdsContext = createContext();

export const AdsProvider = ({children}) => {
  const [ads, setAds] = useState({
    top: null,
    bottom: null,
    second: null,
    medium: null,
    full: null,
  });

  useEffect(() => {
    const fetchData = database()
      .ref('/ads/data')
      .on('value', snapshot => {
        const res = snapshot.val();
        if (!res) {
          return;
        }
        let data = [];
        Object.keys(res).forEach(key => {
          // Check if list exists and is an array before using map
          if (Array.isArray(res[key].list)) {
            res[key].list.forEach(item => {
              if (item.isAllowed) {
                data.push(item);
              }
            });
          }
        });

        data = data.filter(item => {
          return moment().isBetween(
            moment(item.startDate, 'DD MMMM YYYY'),
            moment(item.endDate, 'DD MMMM YYYY'),
          );
        });

        const top = data.filter(item => item.adsConfig.tipe === 'Top Banner');
        const bottom = data.filter(
          item => item.adsConfig.tipe === 'Bottom Banner',
        );
        const second = data.filter(
          item => item.adsConfig.tipe === 'Second Banner',
        );
        const medium = data.filter(
          item => item.adsConfig.tipe === 'Medium Banner',
        );
        const full = data.filter(item => item.adsConfig.tipe === 'Full Page');

        setAds({
          top,
          bottom,
          second,
          medium,
          full,
        });
      });

    return () => database().ref('/ads/data').off('value', fetchData);
  }, []);

  return (
    <AdsContext.Provider
      value={{
        top: ads.top,
        bottom: ads.bottom,
        second: ads.second,
        medium: ads.medium,
        full: ads.full,
      }}>
      {children}
    </AdsContext.Provider>
  );
};
