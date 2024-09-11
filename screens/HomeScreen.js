import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, RefreshControl, Modal, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../constants/colors';
import settingsIcon from '../assets/settings.png';
import closeIcon from '../assets/close.png'; // Imagen para el botón de cerrar

const HomeScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false); // Estado para el modal de configuración de idioma
  const [language, setLanguage] = useState('es'); // Estado para el idioma
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro

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
        setModalVisible(true); // Muestra el modal de confirmación de la foto
      } else {
        Alert.alert('Error', 'No se pudo obtener la imagen');
      }
    } catch (error) {
      console.error('Error al abrir la cámara:', error);
      Alert.alert('Error', 'Hubo un problema al abrir la cámara');
    }
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
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container(darkMode)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* Fondo blanco en lugar de imagen */}
      <View style={styles.backgroundWhite(darkMode)} />

      <View style={styles.titleContainer}>
        <Text style={styles.title(darkMode)}>{language === 'es' ? 'Car Price' : 'Car Price'}</Text>
        <TouchableOpacity onPress={openSettingsModal} style={styles.settingsButton}>
          <Image source={settingsIcon} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      {/* Recuadro de "Cómo Funciona" */}
      <View style={styles.subtitleContainer(darkMode)}>
        <Text style={styles.subtitle(darkMode)}>
          <Text style={styles.subtitleHeader(darkMode)}>{language === 'es' ? 'Cómo Funciona' : 'How It Works'}</Text>{'\n\n'}
          <Text style={styles.subtitleItem(darkMode)}>1. 📸 {language === 'es' ? 'Toma una Foto del Auto:' : 'Take a Photo of the Car:'}</Text>{'\n'}
          {language === 'es' ? 'Abre la cámara del teléfono y toma una foto del auto.' : 'Open your phone’s camera and take a photo of the car.'}{'\n\n'}
          <Text style={styles.subtitleItem(darkMode)}>2. 📝 {language === 'es' ? 'Consulta el Precio:' : 'Check the Price:'}</Text>{'\n'}
          {language === 'es' ? 'Recibirás una estimación del precio del auto en base a la foto.' : 'You will receive an estimate of the car’s price based on the photo.'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
          <Text style={styles.cameraButtonText}>{language === 'es' ? 'Abrir Camara' : 'Open Camera'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer(darkMode)}>
          <View style={styles.modalContent(darkMode)}>
            <Text style={styles.modalTitle(darkMode)}>{language === 'es' ? 'Confirmar Fotografía' : 'Confirm Photo'}</Text>
            {image && <Image source={{ uri: image }} style={styles.modalImage} />}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton(darkMode)} onPress={handleConfirm}>
                <Text style={styles.modalButtonText(darkMode)}>{language === 'es' ? 'Confirmar' : 'Confirm'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton(darkMode)} onPress={handleRetake}>
                <Text style={styles.modalButtonText(darkMode)}>{language === 'es' ? 'Rehacer' : 'Retake'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton(darkMode)} onPress={handleCancel}>
                <Text style={styles.modalButtonText(darkMode)}>{language === 'es' ? 'Cancelar' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSettingsModal}
      >
        <View style={styles.settingsModalContent(darkMode)}>
          <TouchableOpacity style={styles.closeSettingsButton} onPress={closeSettingsModal}>
            <Text style={styles.closeSettingsButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.settingsTitle(darkMode)}>{language === 'es' ? 'Configuración' : 'Settings'}</Text>
          <Text style={styles.settingsOptionText(darkMode)}>{language === 'es' ? 'Seleccionar Idioma' : 'Select Language'}</Text>
          <TouchableOpacity style={styles.settingsOption} onPress={() => changeLanguage('es')}>
            <Text style={styles.settingsOptionText(darkMode)}>{language === 'es' ? 'Español' : 'Spanish'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsOption} onPress={() => changeLanguage('en')}>
            <Text style={styles.settingsOptionText(darkMode)}>{language === 'es' ? 'Inglés' : 'English'}</Text>
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Text style={styles.settingsOptionText(darkMode)}>{language === 'es' ? 'Modo Oscuro' : 'Dark Mode'}</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>
      </Modal>

      {/* Área de fondo "Add Space" */}
      <View style={styles.addSpaceContainer(darkMode)}>
        <Text style={styles.addSpaceText(darkMode)}>{language === 'es' ? 'Espacio para Anuncios' : 'Ad Space'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (darkMode) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkMode ? '#121212' : '#fff',
  }),
  backgroundWhite: (darkMode) => ({
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: darkMode ? '#121212' : '#fff',
  }),
  titleContainer: {
    position: 'absolute',
    top: hp('5%'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    left: wp('35%'),
    zIndex: 2,
  },
  title: (darkMode) => ({
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: darkMode ? '#fff' : colors.text,
  }),
  settingsButton: {
    marginLeft: wp('20%'),
  },
  settingsIcon: {
    width: wp('10%'),
    height: hp('5%'),
  },
  subtitleContainer: (darkMode) => ({
    position: 'absolute',
    top: hp('20%'), // Ajusta esta propiedad para mover el recuadro más al centro
    alignSelf: 'center',
    padding: wp('4%'),
    width: wp('80%'), // Ajusta el ancho del contenedor
    backgroundColor: darkMode ? 'rgba(33, 33, 33, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkMode ? '#424242' : colors.border,
    zIndex: 1,
    alignItems: 'center', // Alinea el texto al centro del contenedor
  }),
  subtitle: (darkMode) => ({
    fontSize: wp('4%'),
    color: darkMode ? '#fff' : colors.text,
    textAlign: 'center', // Centra el texto dentro del contenedor
    lineHeight: hp('3%'), // Ajusta el espaciado entre líneas
  }),
  subtitleHeader: (darkMode) => ({
    fontWeight: 'bold',
    color: darkMode ? '#fff' : colors.text,
    fontSize: wp('4.5%'), // Tamaño del texto para el encabezado
  }),
  subtitleItem: (darkMode) => ({
    fontWeight: 'bold',
    color: darkMode ? '#fff' : colors.text,
    fontSize: wp('4%'), // Tamaño del texto para los elementos
  }),
  buttonContainer: {
    position: 'absolute',
    bottom: hp('30%'), // Ajusta esta propiedad para mover el botón más arriba si es necesario
    alignSelf: 'center',
  },
  cameraButton: {
    backgroundColor: '#3D619B', // Color del botón
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 5,
    elevation: 5, // Elevation para Android
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 6, // Radio de la sombra
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  modalContainer: (darkMode) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  }),
  modalContent: (darkMode) => ({
    backgroundColor: darkMode ? '#333' : '#fff',
    borderRadius: 10,
    padding: wp('5%'),
    width: wp('80%'),
    alignItems: 'center',
  }),
  modalTitle: (darkMode) => ({
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    color: darkMode ? '#fff' : '#000',
  }),
  modalImage: {
    width: wp('70%'),
    height: hp('30%'),
    marginBottom: hp('2%'),
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: (darkMode) => ({
    backgroundColor: colors.primary,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 5,
    margin: wp('1%'),
  }),
  modalButtonText: (darkMode) => ({
    color: darkMode ? '#333' : '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  }),
  settingsModalContent: (darkMode) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  }),
  settingsTitle: (darkMode) => ({
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp('2%'),
  }),
  settingsOption: {
    backgroundColor: colors.primary,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: 5,
    margin: hp('1%'),
  },
  settingsOptionText: (darkMode) => ({
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  }),
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  closeSettingsButton: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('2%'),
    backgroundColor: 'transparent',
  },
  closeSettingsButtonText: {
    fontSize: wp('6%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  addSpaceContainer: (darkMode) => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: darkMode ? '#424242' : '#f0f0f0',
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  }),
  addSpaceText: (darkMode) => ({
    color: darkMode ? '#fff' : '#000',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  }),
});

export default HomeScreen;
