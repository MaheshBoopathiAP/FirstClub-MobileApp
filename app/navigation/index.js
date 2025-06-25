import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import Discover from '../screens/Discover';
import OTPVerification from '../screens/OTPVerification';
import ChooseLocationScreen from '../screens/LocationMap';
import NextMapScreen from '../screens/NextMapScreen';
import MobileOTP from '../screens/MobileOTP';
import Page1 from '../screens/preferenceSelections/Page1';
import Page2 from '../screens/preferenceSelections/Page2';
import Page3 from '../screens/preferenceSelections/Page3';
import SamplesScreen from '../screens/samples';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MobileOTP" component={MobileOTP} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="Samples" component={SamplesScreen} />
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="ChooseLocation" component={ChooseLocationScreen} />
        <Stack.Screen name="NextMapForm" component={NextMapScreen} />
        <Stack.Screen name="Preference" component={Page1} />
        <Stack.Screen name="PreferencePage1" component={Page1} />
        <Stack.Screen name="PreferencePage2" component={Page2} />
        <Stack.Screen name="PreferencePage3" component={Page3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}