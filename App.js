import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const App = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es'); // Default language is Spanish

  // Solicitar permisos para la cámara y la galería
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    setHasCameraPermission(cameraStatus === 'granted');
    setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');
  };

  // Función para abrir la cámara
  const openCamera = async () => {
    if (hasCameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setImageUri(uri);
        if (hasMediaLibraryPermission) {
          try {
            // Guardar la imagen en la galería
            await MediaLibrary.createAssetAsync(uri);
            setPhotoModalVisible(true); // Mostrar el modal con la foto
          } catch (error) {
            console.error('Error al guardar la imagen:', error);
            Alert.alert('Error', 'Hubo un problema al guardar la imagen en la galería.');
          }
        } else {
          Alert.alert('Permiso denegado', 'No tienes permiso para acceder a la galería.');
        }
      } else {
        Alert.alert('Error', 'No se tomó ninguna imagen.');
      }
    } else {
      Alert.alert('Permiso denegado', 'No tienes permiso para usar la cámara.');
    }
  };

  // Función para tomar otra foto
  const handleTakeAnother = () => {
    setPhotoModalVisible(false);
    openCamera();
  };

  // Función para continuar
  const handleContinue = () => {
    setPhotoModalVisible(false);
    // Aquí puedes agregar la lógica para continuar con la aplicación
  };

  // Solicitar permisos cuando se monta el componente
  useEffect(() => {
    requestPermissions();
  }, []);

  // Función para cambiar el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Función para cambiar el idioma
  const changeLanguage = (lang) => {
    setLanguage(lang);
    // No cerramos el modal cuando se cambia el idioma
  };

  // Traducciones
  const translations = {
    es: {
      settings: 'Configuración',
      language: 'Idioma',
      darkMode: 'Modo Oscuro',
      close: 'Cerrar',
      openCamera: 'Abrir Cámara',
      howItWorks: 'Cómo Funciona',
      takePhoto: 'Toma una Foto del Auto:',
      checkPrice: 'Consulta el Precio:',
      adSpace: 'Espacio para anuncios',
    },
    en: {
      settings: 'Settings',
      language: 'Language',
      darkMode: 'Dark Mode',
      close: 'Close',
      openCamera: 'Open Camera',
      howItWorks: 'How It Works',
      takePhoto: 'Take a Photo of the Car:',
      checkPrice: 'Check the Price:',
      adSpace: 'Add Space',
    },
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>Car Price</Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        {/* Recuadro con instrucciones */}
        <View style={[styles.instructionBox, darkMode && styles.darkInstructionBox]}>
          <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>
            <Text style={[styles.subtitleHeader, darkMode && styles.darkSubtitleHeader]}>
              {translations[language].howItWorks}
            </Text>{'\n\n'}
            <Text style={[styles.subtitleItem, darkMode && styles.darkSubtitleItem]}>
              1. 📸 {translations[language].takePhoto}
            </Text>{'\n'}
            {language === 'es' ? 'Abre la cámara del teléfono y toma una foto del auto.' : 'Open your phone’s camera and take a photo of the car.'}{'\n\n'}
            <Text style={[styles.subtitleItem, darkMode && styles.darkSubtitleItem]}>
              2. 📝 {translations[language].checkPrice}
            </Text>{'\n'}
            {language === 'es' ? 'Recibirás una estimación del precio del auto en base a la foto.' : 'You will receive an estimate of the car’s price based on the photo.'}
          </Text>
        </View>

        {/* Botón de abrir cámara */}
        <TouchableOpacity style={[styles.button, darkMode && styles.darkButton]} onPress={openCamera}>
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>
            {translations[language].openCamera}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón de configuración */}
      <TouchableOpacity style={[styles.settingsButton, darkMode && styles.darkSettingsButton]} onPress={() => setModalVisible(true)}>
        <Image source={require('./assets/settings.png')} style={styles.settingsIcon} />
      </TouchableOpacity>

      {/* Modal de configuración */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, darkMode && styles.darkModalContainer]}>
          <View style={[styles.modalContent, darkMode && styles.darkModalContent]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, darkMode && styles.darkModalTitle]}>{translations[language].settings}</Text>
            <TouchableOpacity
              onPress={() => changeLanguage('es')}
              style={[styles.languageButton, language === 'es' && styles.selectedLanguageButton]}
            >
              <Text style={styles.languageButtonText}>Español</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeLanguage('en')}
              style={[styles.languageButton, language === 'en' && styles.selectedLanguageButton]}
            >
              <Text style={styles.languageButtonText}>English</Text>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, darkMode && styles.darkSwitchLabel]}>{translations[language].darkMode}</Text>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal con la foto tomada */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.photoModalContainer}>
          <View style={styles.photoModalContent}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.photoModalButtonsContainer}>
              <TouchableOpacity style={styles.takeAnotherButton} onPress={handleTakeAnother}>
                <Text style={styles.takeAnotherButtonText}>{language === 'es' ? 'Tomar Otra' : 'Take Another'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>{language === 'es' ? 'Continuar' : 'Continue'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Espacio para anuncios */}
      <View style={styles.adContainer}>
        <Text style={styles.adText}>
          {translations[language].adSpace}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Esto asegura que el contenido se distribuya con espacio entre
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  titleContainer: {
    position: 'absolute',
    top: 40, // Ajusta esta propiedad para mover el título más arriba o abajo
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkTitle: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructionBox: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  darkInstructionBox: {
    backgroundColor: '#444',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  darkSubtitle: {
    color: '#ccc',
  },
  subtitleHeader: {
    fontWeight: 'bold',
  },
  darkSubtitleHeader: {
    color: '#fff',
  },
  subtitleItem: {
    fontSize: 14,
  },
  darkSubtitleItem: {
    color: '#aaa',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  darkButtonText: {
    color: '#ccc',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative', // Necesario para posicionar la X
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  darkModalContent: {
    backgroundColor: '#444',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  darkModalTitle: {
    color: '#fff',
  },
  languageButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF', // Color azul para los botones
    marginBottom: 10,
  },
  selectedLanguageButton: {
    backgroundColor: '#0056b3', // Color más oscuro para el botón seleccionado
  },
  languageButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  darkSwitchLabel: {
    color: '#ccc',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#fff', // Color de fondo del círculo
  },
  closeButtonText: {
    fontSize: 20,
    color: '#007BFF', // Color de la X
  },
  darkCloseButton: {
    backgroundColor: '#444',
  },
  darkCloseButtonText: {
    color: '#fff',
  },
  photoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  photoModalButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  takeAnotherButton: {
    backgroundColor: '#FF0000', // Color rojo
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  continueButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  takeAnotherButtonText: {
    color: '#fff',
  },
  continueButtonText: {
    color: '#fff',
  },
  adContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  adText: {
    fontSize: 14,
  },
});

export default App;
