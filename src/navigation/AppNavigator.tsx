import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import PharmacyScreen from '../screens/Pharmacy/PharmacyScreen';
import ProductDetailScreen from '../screens/ProductDetail/ProductDetailScreen';
import CartScreen from '../screens/Cart/CartScreen';
import { colors } from '../theme/colors';
import { CartProvider } from '../context/CartContext';

// Types
type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  ProductDetail: { productId?: string };
  Cart: undefined;
};

type TabParamList = {
  Home: undefined;
  Doctor: undefined;
  Pharmacy: undefined;
  LabTest: undefined;
  Profile: undefined;
};

export type { RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '❓';

          switch (route.name) {
            case 'Home':
              iconName = '🏠';
              break;
            case 'Doctor':
              iconName = '👨‍⚕️';
              break;
            case 'Pharmacy':
              iconName = '💊';
              break;
            case 'LabTest':
              iconName = '🧪';
              break;
            case 'Profile':
              iconName = '👤';
              break;
          }

          return <Text style={{ fontSize: 24 }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarStyle: { height: 60, paddingBottom: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Doctor" 
        component={PharmacyScreen} // Replace with DoctorScreen component when available
        options={{ title: 'Doctor' }}
      />
      <Tab.Screen 
        name="Pharmacy" 
        component={PharmacyScreen} 
        options={{ title: 'Pharmacy' }}
      />
      <Tab.Screen 
        name="LabTest" 
        component={PharmacyScreen} // Replace with LabTestScreen component when available
        options={{ title: 'Lab Test' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PharmacyScreen} // Replace with ProfileScreen component when available
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
const AppNavigator = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
          }}
        >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default AppNavigator;
