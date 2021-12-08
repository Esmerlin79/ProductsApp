import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './src/navigator/StackNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';

const App = () => {

  const AppState = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
      <AuthProvider>
        <ProductsProvider>
          { children }
        </ProductsProvider>
      </AuthProvider>
    )
  }

  return (
    <NavigationContainer>
      <AppState>
        <StackNavigator />
      </AppState>
    </NavigationContainer>
  )
}

export default App
