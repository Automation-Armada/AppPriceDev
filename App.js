import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

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
  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Price</Text>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Abrir Cámara</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3D619B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
