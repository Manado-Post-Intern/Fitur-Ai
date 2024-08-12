import {
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import {Banner1, Gap, TextInter, TopBar} from '../../components';
import {IcBack, theme} from '../../assets';
import {CardListDigital, CardListNewspaper, More} from './components';
import {screenHeightPercentage} from '../../utils';
import {MPDigitalContext} from '../../context/MPDigitalContext';
import {AuthContext} from '../../context/AuthContext';

const Paper3D = ({navigation}) => {
  const {loading, setLoading, fetchData} = useContext(MPDigitalContext);
  const {mpUser} = useContext(AuthContext);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.topBarContainer}>
        <TopBar type="paper" />
      </View>
      <View style>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                setLoading(true);
                fetchData();
              }}
            />
          }
          style={styles.container}>
          <View style={styles.bodyContainer}>
            {/* <View style={styles.headerContainer}>
              <IcBack />
              <TextInter style={styles.headerText}>E-Paper</TextInter>
            </View> */}

            <Banner1 />

            <Gap height={8} />
            <View>
              <View style={styles.titleContainer}>
                <TextInter style={styles.title}>MP Digital</TextInter>
              </View>
              <Gap height={8} />
              <CardListDigital />
              <Gap height={4} />
              <View>
                <More to={'MPDigitalAll'} />
              </View>
            </View>

            <View>
              <View style={styles.titleContainer}>
                <TextInter style={styles.title}>MP Koran</TextInter>
              </View>
              <Gap height={8} />
              <CardListNewspaper />
              <Gap height={4} />
              <View>
                <More to="MPKoranAll" />
              </View>
            </View>
          </View>

          <Gap height={screenHeightPercentage('19%')} />
        </ScrollView>
        {mpUser?.subscription?.isExpired === true ? (
          <View
            blurType="light"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 8,
                alignItems: 'center',

                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,
                elevation: 11,
              }}>
              <Text style={{color: theme.colors.MPBlue0}}>
                Anda perlu berlangganan MP Digital Premium untuk membaca MP
                Digital dan MP Koran
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Subscription')}
                style={{
                  backgroundColor: theme.colors.MPBlue5,
                  padding: 5,
                  margin: 10,
                  borderRadius: 5,
                }}>
                <Text style={{color: theme.colors.white}}>
                  Berlangganan Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Paper3D;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
  },
  topBarContainer: {
    zIndex: 100,
  },

  bodyContainer: {
    paddingTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },

  titleContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: theme.colors.MPGrey2,
    fontWeight: '700',
    marginLeft: 16,
  },
});
