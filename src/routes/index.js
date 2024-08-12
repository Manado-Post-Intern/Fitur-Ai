import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Ads,
  Article,
  ChooseCanal,
  ChooseRegion,
  Home,
  Highlight,
  Meta,
  MPDigitalAll,
  MPKoranAll,
  NewPassword,
  Onboarding,
  OTPVerification,
  Paper3D,
  ReadPaper,
  Region,
  RegionSearch,
  Search,
  SearchPaper,
  SideMenu,
  SignIn,
  Splash,
  Trending,
  Preview as AdsPreview,
  Profile,
  AboutUs,
  Subscription,
  Order as AdsOrder,
  Marketplace,
  CreateAds,
  MetaDetail,
  MetaMore,
  MoreNews,
  WriteNews,
  ChannelTagSelection,
} from '../screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {screenHeightPercentage} from '../utils';
import {BottomTabBar, TopBar} from '../components';
import {AuthContext} from '../context/AuthContext';

/**
 * Home Bottom Tab Bar Navigation Routes
 */
const HomeTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          return <BottomTabBar route={route} focused={focused} />;
        },
        header: () => {
          return <TopBar type="home" />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
          height: screenHeightPercentage('10.5%'),
          minHeight: 80,
        },
      })}>
      <Tab.Screen name="Trending" component={Trending} />
      <Tab.Screen
        name="Region"
        component={Region}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Meta" component={Meta} options={{headerShown: false}} />
      <Tab.Screen
        name="Paper3D"
        component={Paper3D}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

// USER REQUIRE LOGIN
const PrivateRoutes = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChooseCanal" component={ChooseCanal} />
      <Stack.Screen name="ChooseRegion" component={ChooseRegion} />
      <Stack.Screen name="HomeTab" component={HomeTab} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="MPDigitalAll" component={MPDigitalAll} />
      <Stack.Screen name="SearchPaper" component={SearchPaper} />
      <Stack.Screen name="ReadPaper" component={ReadPaper} />
      <Stack.Screen name="MPKoranAll" component={MPKoranAll} />
      <Stack.Screen name="RegionSearch" component={RegionSearch} />
      <Stack.Screen name="Highlight" component={Highlight} />
      <Stack.Screen name="Article" component={Article} />
      <Stack.Screen name="SideMenu" component={SideMenu} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Ads" component={Ads} />
      <Stack.Screen name="AdsPreview" component={AdsPreview} />
      <Stack.Screen name="AdsOrder" component={AdsOrder} />
      <Stack.Screen name="Marketplace" component={Marketplace} />
      <Stack.Screen name="CreateAds" component={CreateAds} />
      <Stack.Screen name="MetaDetail" component={MetaDetail} />
      <Stack.Screen name="MoreNews" component={MoreNews} />
      <Stack.Screen name="MetaMore" component={MetaMore} />
      <Stack.Screen name="WriteNews" component={WriteNews} />
      <Stack.Screen
        name="ChannelTagSelection"
        component={ChannelTagSelection}
      />
    </Stack.Navigator>
  );
};

/**
 * Main Root Routes
 */
const Routes = () => {
  const {user} = useContext(AuthContext);
  const Stack = createNativeStackNavigator();
  return !user ? (
    <Stack.Navigator
      initialRouteName="Splash"
      // initialRouteName="Splash" // TODO: Change this to Home
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  ) : (
    <PrivateRoutes />
  );
};

export default Routes;
