import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../constants/colors';

const ConfirmationScreen = () => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();
  const route = useRoute();

  // Obtener la URI de la imagen desde los parámetros de la ruta
  const imageUri = route.params?.imageUri;

  const handleConsult = () => {
    // Enlace a Google
    Linking.openURL('https://www.google.com');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/resultado.png')} 
        style={[styles.backgroundImage, { width, height }]} 
        resizeMode="stretch" 
      />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image 
          source={require('../assets/back.png')} 
          style={styles.backButtonImage} 
        />
      </TouchableOpacity>

      {/* Mostrar la imagen si está disponible */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.modalImage} />
      )}

      <TouchableOpacity 
        style={styles.consultButton}
        onPress={handleConsult}
      >
        <Text style={styles.consultButtonText}>Consultar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  consultButton: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: 'green', // Color verde
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    left: 20,
  },
  consultButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 70,
  },
});

export default ConfirmationScreen;
