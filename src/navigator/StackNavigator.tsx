import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProtectedScreen from '../screens/ProtectedScreen';
import LoadingScreen from '../screens/LoadingScreen';
import ProductsNavigator from './ProductsNavigator';
import { View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const StackNavigator = () => {

  const { status } = useContext(AuthContext);

  if( status === 'checking' ) return <LoadingScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlay: () => (
          <View 
            style={{ flex: 1, backgroundColor: '#5856D6'}}
          />
        ),
        cardStyle: {
          backgroundColor: 'white'
        }
      }}
    >

      { status !== 'authenticated' 
        ? (
          <>
            <Stack.Screen name="LoginScreen"  component={LoginScreen} />
            <Stack.Screen name="RegisterScreen"  component={RegisterScreen} />          
          </>
        ) : (
            <Stack.Screen name="ProductsNavigator" component={ProductsNavigator} />
        )
      }
    </Stack.Navigator>
  );
}

export default StackNavigator 