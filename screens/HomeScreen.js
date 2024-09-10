import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, RefreshControl, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import colors from '../constants/colors';
import settingsIcon from '../assets/settings.png';
import addIcon from '../assets/add.png'; // Imagen para el anuncio
import closeIcon from '../assets/close.png'; // Imagen para el botón de cerrar

const HomeScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [adModalVisible, setAdModalVisible] = useState(false); // Nuevo estado para el modal del anuncio
  const [settingsModalVisible, setSettingsModalVisible] = useState(false); // Estado para el modal de configuración de idioma
  const [language, setLanguage] = useState('es'); // Estado para el idioma

  const openCamera = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para usar la cámara');
        return;
      }

      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibraryStatus !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        Alert.alert('Error', 'No se tomó ninguna imagen');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        setAdModalVisible(true); // Muestra el modal del anuncio
      } else {
        Alert.alert('Error', 'No se pudo obtener la imagen');
      }
    } catch (error) {
      console.error('Error al abrir la cámara:', error);
      Alert.alert('Error', 'Hubo un problema al abrir la cámara');
    }
  };

  const handleAdClose = () => {
    setAdModalVisible(false);
    setModalVisible(true); // Muestra el modal de confirmación de la foto
  };

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('Confirmation', { imageUri: image }); // Pasar la URI de la imagen
  };

  const handleCancel = () => {
    setModalVisible(false);
    // Opcional: Puedes añadir lógica para cancelar la acción aquí
  };

  const handleRetake = () => {
    setModalVisible(false);
    openCamera();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const openSettingsModal = () => {
    setSettingsModalVisible(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalVisible(false);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    closeSettingsModal();
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
      <Image source={require('../assets/AutoPrice.png')} style={styles.backgroundImage} />
      <Image source={require('../assets/fondo.png')} style={styles.overlayImage} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{language === 'es' ? 'Car Price' : 'Car Price'}</Text>
        <TouchableOpacity onPress={openSettingsModal} style={styles.settingsButton}>
          <Image source={settingsIcon} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          <Text style={styles.subtitleHeader}>{language === 'es' ? 'Cómo Funciona' : 'How It Works'}</Text>{'\n\n'}
          <Text style={styles.subtitleItem}>1. 📸 {language === 'es' ? 'Toma una Foto del Auto:' : 'Take a Photo of the Car:'}</Text>{'\n'}
          {language === 'es' ? 'Abre la cámara de tu dispositivo desde la app y captura una imagen del auto que deseas valorar.' : 'Open your device’s camera from the app and capture an image of the car you want to evaluate.'}{'\n\n'}
          <Text style={styles.subtitleItem}>2. 💵 {language === 'es' ? 'Valoración Instantánea:' : 'Instant Valuation:'}</Text>{'\n'}
          {language === 'es' ? 'La app analiza la foto y proporciona una estimación inmediata del valor del auto.' : 'The app analyzes the photo and provides an immediate estimate of the car’s value.'}
        </Text>
      </View>
      
      <TouchableOpacity onPress={openCamera} style={styles.buttonContainer}>
        <View style={styles.cameraButton}>
          <Text style={styles.cameraButtonText}>Abrir Cámara</Text>
        </View>
      </TouchableOpacity>

      {/* Modal del anuncio */}
      <Modal
        visible={adModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAdModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.adModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleAdClose}
            >
              <Image source={closeIcon} style={styles.closeButtonImage} />
            </TouchableOpacity>
            <Image source={addIcon} style={styles.adImage} />
          </View>
        </View>
      </Modal>

     {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{language === 'es' ? '¿La foto es correcta?' : 'Is the photo correct?'}</Text>
            {image ? (
              <Image source={{ uri: image }} style={styles.modalImage} />
            ) : (
              <Text>{language === 'es' ? 'No hay imagen para mostrar' : 'No image to show'}</Text>
            )}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={handleConfirm} style={[styles.modalButton, { backgroundColor: 'green' }]}>
                <Text style={styles.modalButtonText}>{language === 'es' ? 'Aceptar' : 'View'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={[styles.modalButton, { backgroundColor: 'red' }]}>
                <Text style={styles.modalButtonText}>{language === 'es' ? 'Cancelar' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de configuración de idioma */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSettingsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.settingsModalContent}>
            <Text style={styles.settingsTitle}>{language === 'es' ? 'Selecciona Idioma' : 'Select Language'}</Text>
            <TouchableOpacity onPress={() => changeLanguage('es')} style={styles.settingsOption}>
              <Text style={styles.settingsOptionText}>{language === 'es' ? 'Español' : 'Spanish'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.settingsOption}>
              <Text style={styles.settingsOptionText}>{language === 'es' ? 'Inglés' : 'English'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    resizeMode: 'contain',
    width: '70%',
    height: '50%',
    position: 'absolute',
    top: '-2%',
    left: '15%',
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    left: '35%',
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  settingsButton: {
    marginLeft: 10,
  },
  settingsIcon: {
    width: 38,
    left: 100,
    height: 23,
  },
  subtitleContainer: {
    position: 'absolute',
    top: 250,
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
    top: 500,
    zIndex: 2,
  },
  cameraButton: {
    backgroundColor: '#007bff', // Azul para el botón
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    color: '#fff', // Blanco para el texto
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semi-transparente
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  adModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'transparent', // Fondo transparente
    borderRadius: 5,
  },
  closeButtonImage: {
    width: 20,
    height: 20,
  },
  adImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: colors.button,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  settingsModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingsOption: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.button,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  settingsOptionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
