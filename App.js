import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Solicitar permiso para usar la cámara
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
  };

  // Función para abrir la cámara
  const openCamera = async () => {
    if (hasCameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        // Aquí puedes hacer algo con la imagen, como mostrarla en la pantalla
        Alert.alert('Imagen tomada', '¡Se ha tomado una imagen con éxito!');
      } else {
        Alert.alert('Error', 'No se tomó ninguna imagen.');
      }
    } else {
      Alert.alert('Permiso denegado', 'No tienes permiso para usar la cámara.');
    }
  };

  // Solicitar permisos cuando se monta el componente
  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Función para cambiar el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.title, darkMode && styles.darkTitle]}>Car Price</Text>
      <TouchableOpacity style={[styles.button, darkMode && styles.darkButton]} onPress={openCamera}>
        <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Abrir Cámara</Text>
      </TouchableOpacity>

      {/* Botón de configuración */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
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
            <Text style={[styles.modalOption, darkMode && styles.darkModalOption]}>Español</Text>
            <Text style={[styles.modalOption, darkMode && styles.darkModalOption]}>Inglés</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkTitle: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#3D619B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  darkButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#ddd',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkModalTitle: {
    color: '#fff',
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
    color: '#000',
  },
  darkModalOption: {
    color: '#ddd',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  darkSwitchLabel: {
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3D619B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  darkCloseButton: {
    backgroundColor: '#555',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkCloseButtonText: {
    color: '#ddd',
  },
});

export default App;
