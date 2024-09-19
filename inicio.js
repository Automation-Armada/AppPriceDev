// inicio.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Inicio = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigation.replace('MainApp'); // Cambia 'MainApp' al nombre de tu ruta principal
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/inicio.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return null; // Puedes retornar null o un componente de carga
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Inicio;
