import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ConfirmationScreen from './screens/ConfirmationScreen'; // Asegúrate de importar la pantalla correctamente

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Cambia a "Home" si ya no usas SplashScreen
        screenOptions={{ headerShown: false }} // Oculta el encabezado de las pantallas
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
