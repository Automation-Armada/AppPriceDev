// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../constants/colors';

// Importa el nuevo icono
import settingsIcon from '../assets/settings.png';

const HomeScreen = () => {
  const [image, setImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Se necesita permiso para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí puedes hacer cualquier acción que desees cuando se recargue la pantalla
    // Por ejemplo, reiniciar el estado o hacer una solicitud de actualización
    // En este caso, simplemente estamos simulando una recarga y luego se detiene la animación de refresco
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* Imagen de fondo visible */}
      <Image source={require('../assets/AutoPrice.png')} style={styles.backgroundImage} />
      
      {/* Imagen en la capa superior */}
      <Image source={require('../assets/fondo.png')} style={styles.overlayImage} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Auto Price</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Image source={settingsIcon} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          <Text style={styles.subtitleHeader}>Como Funciona</Text>{'\n\n'}
          <Text style={styles.subtitleItem}>1. 📸 Toma una Foto del Auto:</Text>{'\n'}
          Abre la cámara de tu dispositivo desde la app y captura una imagen del auto que deseas valorar.{'\n\n'}
          <Text style={styles.subtitleItem}>2. 💵 Valoración Instantánea:</Text>{'\n'}
          La app analiza la foto y proporciona una estimación inmediata del valor del auto.
        </Text>
      </View>
      
      <TouchableOpacity onPress={openCamera} style={styles.buttonContainer}>
        <Image source={require('../assets/camera_icon.jpg')} style={styles.cameraIcon} />
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  overlayImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
    width: '80%',
    height: '50%',
    top: '10%',
    left: '10%',
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: -130,
    zIndex: 3, // Asegúrate de que esté en el nivel superior
  },
  settingsIcon: {
    width: 38,
    height: 23,
  },
  subtitleContainer: {
    position: 'absolute',
    top: 390,
    alignSelf: 'center',
    marginHorizontal: 20,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'System',
  },
  subtitleHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitleItem: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  buttonContainer: {
    position: 'absolute',
    top: 630,
    zIndex: 2,
  },
  cameraIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    zIndex: 2,
  },
});

export default HomeScreen;
