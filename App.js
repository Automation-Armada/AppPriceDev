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
            Alert.alert('Imagen guardada', 'La imagen se ha guardado en la galería con éxito.');
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
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>Car Price</Text>
      </View>

      {/* Recuadro con instrucciones */}
      <View style={[styles.instructionBox, darkMode && styles.darkInstructionBox]}>
        <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>
          <Text style={[styles.subtitleHeader, darkMode && styles.darkSubtitleHeader]}>
            {language === 'es' ? 'Cómo Funciona' : 'How It Works'}
          </Text>{'\n\n'}
          <Text style={[styles.subtitleItem, darkMode && styles.darkSubtitleItem]}>
            1. 📸 {language === 'es' ? 'Toma una Foto del Auto:' : 'Take a Photo of the Car:'}
          </Text>{'\n'}
          {language === 'es' ? 'Abre la cámara del teléfono y toma una foto del auto.' : 'Open your phone’s camera and take a photo of the car.'}{'\n\n'}
          <Text style={[styles.subtitleItem, darkMode && styles.darkSubtitleItem]}>
            2. 📝 {language === 'es' ? 'Consulta el Precio:' : 'Check the Price:'}
          </Text>{'\n'}
          {language === 'es' ? 'Recibirás una estimación del precio del auto en base a la foto.' : 'You will receive an estimate of the car’s price based on the photo.'}
        </Text>
      </View>

      {/* Botón de abrir cámara */}
      <TouchableOpacity style={[styles.button, darkMode && styles.darkButton]} onPress={openCamera}>
        <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>
          {language === 'es' ? 'Abrir Cámara' : 'Open Camera'}
        </Text>
      </TouchableOpacity>

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
            <Text style={[styles.modalTitle, darkMode && styles.darkModalTitle]}>Configuración</Text>
            <TouchableOpacity onPress={() => changeLanguage('es')} style={styles.languageButton}>
              <Text style={[styles.languageButtonText, language === 'es' && styles.selectedLanguage]}>
                Español
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.languageButton}>
              <Text style={[styles.languageButtonText, language === 'en' && styles.selectedLanguage]}>
                Inglés
              </Text>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, darkMode && styles.darkSwitchLabel]}>Modo Oscuro</Text>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
              />
            </View>
            <TouchableOpacity style={[styles.closeButton, darkMode && styles.darkCloseButton]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.closeButtonText, darkMode && styles.darkCloseButtonText]}>Cerrar</Text>
            </TouchableOpacity>
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
                <Text style={styles.takeAnotherButtonText}>Tomar Otra</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
  },
  darkTitle: {
    color: '#fff',
  },
  instructionBox: {
    width: '90%',
    padding: 20,
    marginBottom: 40, // Ajusta este margen para separar el recuadro del botón
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  darkInstructionBox: {
    borderColor: '#555',
  },
  subtitle: {
    fontSize: 16,
  },
  darkSubtitle: {
    color: '#ddd',
  },
  subtitleHeader: {
    fontWeight: 'bold',
  },
  darkSubtitleHeader: {
    color: '#eee',
  },
  subtitleItem: {
    fontWeight: 'normal',
  },
  darkSubtitleItem: {
    color: '#bbb',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  darkButtonText: {
    color: '#ddd',
  },
  settingsButton: {
    position: 'absolute',
    top: 30,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#444',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkModalTitle: {
    color: '#ddd',
  },
  languageButton: {
    marginVertical: 5,
  },
  languageButtonText: {
    fontSize: 16,
  },
  selectedLanguage: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  darkSwitchLabel: {
    color: '#ddd',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  darkCloseButton: {
    backgroundColor: '#0056b3',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  darkCloseButtonText: {
    color: '#ddd',
  },
  photoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    height: 300,
    resizeMode: 'cover',
  },
  photoModalButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  takeAnotherButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  continueButton: {
    backgroundColor: '#00ff00',
    padding: 10,
    borderRadius: 5,
  },
  takeAnotherButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
