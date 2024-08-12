import axios from 'axios';
import moment from 'moment';
import {createContext, useEffect, useState} from 'react';

export const MPDigitalContext = createContext();

export const MPDigitalProvider = ({children}) => {
  const [data, setData] = useState({
    magazine: [],
    newsPaper: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://api.mpdigital.id/mp');
      const newsData = await res?.data
        ?.filter(item => item.x_type === 'Koran')
        .sort((a, b) => moment(b.publish_date).diff(moment(a.publish_date)));
      const magazineData = await res?.data
        ?.filter(item => item.x_type === 'Digital')
        .sort((a, b) => moment(b.publish_date).diff(moment(a.publish_date)));
      setData({
        magazine: magazineData,
        newsPaper: newsData,
      });
    } catch (error) {
      console.log('on get mp', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <MPDigitalContext.Provider
      value={{
        magazine: data.magazine,
        newsPaper: data.newsPaper,
        setLoading,
        loading,
        fetchData,
      }}>
      {children}
    </MPDigitalContext.Provider>
  );
};
