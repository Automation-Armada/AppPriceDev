import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, RefreshControl, Modal, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from './constants/colors'; // Ajusta la ruta según la ubicación de tu archivo colors.js
import settingsIcon from './assets/settings.png'; // Ajusta la ruta según la ubicación de tu archivo settings.png
import closeIcon from './assets/close.png'; // Ajusta la ruta según la ubicación de tu archivo close.png
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ConfirmationScreen from './screens/ConfirmationScreen'; // Asegúrate de importar la pantalla correctamente

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [language, setLanguage] = useState('es');
  const [darkMode, setDarkMode] = useState(false);

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
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'No se pudo obtener la imagen');
      }
    } catch (error) {
      console.error('Error al abrir la cámara:', error);
      Alert.alert('Error', 'Hubo un problema al abrir la cámara');
    }
  };

  const handleContinue = () => {
    setModalVisible(false);
    navigation.navigate('Confirmation', { 
      imageUri: image,
      backgroundColor: darkMode ? '#121212' : '#fff',
      language: language 
    });
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
      <View style={styles.backgroundWhite(darkMode)} />

      <View style={styles.titleContainer}>
        <Text style={styles.title(darkMode)}>{language === 'es' ? 'Car Price' : 'Car Price'}</Text>
        <TouchableOpacity onPress={openSettingsModal} style={styles.settingsButton}>
          <Image source={settingsIcon} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

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
              <TouchableOpacity style={[styles.modalButton(darkMode), styles.retakeButton]} onPress={handleRetake}>
                <Text style={styles.modalButtonText}>{language === 'es' ? 'Tomar Otra' : 'Retake'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton(darkMode), styles.continueButton]} onPress={handleContinue}>
                <Text style={styles.modalButtonText}>{language === 'es' ? 'Continuar' : 'Continue'}</Text>
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

      <View style={styles.addSpaceContainer(darkMode)}>
        <Text style={styles.addSpaceText(darkMode)}>{language === 'es' ? 'Espacio para Anuncios' : 'Ad Space'}</Text>
      </View>
    </ScrollView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" 
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
    top: hp('20%'),
    alignSelf: 'center',
    padding: wp('4%'),
    width: wp('80%'),
    backgroundColor: darkMode ? 'rgba(33, 33, 33, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkMode ? '#424242' : colors.border,
    zIndex: 1,
    alignItems: 'center',
  }),
  subtitle: (darkMode) => ({
    fontSize: wp('4%'),
    color: darkMode ? '#fff' : colors.text,
    textAlign: 'center',
    lineHeight: hp('3%'),
  }),
  subtitleHeader: (darkMode) => ({
    fontWeight: 'bold',
    color: darkMode ? '#fff' : colors.text,
    fontSize: wp('4.5%'),
  }),
  subtitleItem: (darkMode) => ({
    fontWeight: 'bold',
    color: darkMode ? '#fff' : colors.text,
    fontSize: wp('4%'),
  }),
  buttonContainer: {
    position: 'absolute',
    bottom: hp('30%'),
    alignSelf: 'center',
  },
  cameraButton: {
    backgroundColor: '#3D619B',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 5,
    margin: wp('1%'),
  }),
  retakeButton: {
    backgroundColor: '#70706C',
  },
  continueButton: {
    backgroundColor: '#2B9107',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
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

export default App;
