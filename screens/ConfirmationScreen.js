import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ConfirmationScreen = () => {
  const { width, height } = Dimensions.get('window'); // Obtiene el tamaño de la pantalla
  const navigation = useNavigation();
  const route = useRoute();

  // Obtener la URI de la imagen y otros parámetros desde los parámetros de la ruta
  const imageUri = route.params?.imageUri;
  const backgroundColor = route.params?.backgroundColor || '#FFFFFF'; // Valor por defecto
  const language = route.params?.language || 'es'; // Valor por defecto

  const handleBackToHome = () => {
    navigation.navigate('Home'); // Cambia 'Home' al nombre de tu pantalla de inicio si es diferente
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* Fondo de color basado en el color recibido */}
      <View style={[styles.backgroundColor, { backgroundColor: backgroundColor }]} />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButtonCircle}>
          <Image 
            source={require('../assets/back.png')} 
            style={styles.backButtonImage} 
          />
        </View>
      </TouchableOpacity>

      {/* Mostrar la imagen si está disponible */}
      {imageUri && (
        <View style={[styles.imageContainer, { top: height * 0.13 }]}>
          <Image source={{ uri: imageUri }} style={styles.modalImage} />
        </View>
      )}

      {/* Contenido de chat con burbujas de mensajes */}
      <View style={styles.chatContainer}>
        <View style={[styles.messageBubble, { backgroundColor: '#3D619B' }]}>
          <Text style={styles.messageText}>Marca: Ejemplo Marca</Text>
          <Text style={styles.messageText}>Año: 2022</Text>
          <Text style={styles.messageText}>Modelo: Ejemplo Modelo</Text>
        </View>
        <View style={[styles.messageBubble, { backgroundColor: '#3D619B' }]}>
          <Text style={styles.messageText}>Precio en dólares: $25,000</Text>
          <Text style={styles.messageText}>Precio en pesos: $500,000</Text>
        </View>
      </View>

      {/* Área de fondo "Add Space" */}
      <View style={[styles.addSpaceContainer, { backgroundColor: backgroundColor === '#121212' ? '#424242' : '#f0f0f0' }]}>
        <Text style={[styles.addSpaceText, { color: backgroundColor === '#121212' ? '#fff' : '#000' }]}>{language === 'es' ? 'Espacio para Anuncios' : 'Ad Space'}</Text>
      </View>

      <TouchableOpacity 
        style={styles.consultButton}
        onPress={handleBackToHome}
      >
        <Text style={styles.consultButtonText}>{language === 'es' ? 'Volver a Inicio' : 'Back to Home'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundColor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  backButtonCircle: {
    backgroundColor: '#D3D3D3', // Color gris claro
    borderRadius: 25, // Radio del círculo
    padding: 10, // Espacio alrededor de la imagen
  },
  backButtonImage: {
    width: 30, // Ajusta el tamaño según sea necesario
    height: 30, // Ajusta el tamaño según sea necesario
  },
  consultButton: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: '#2B9107', // Color verde ajustado
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    left: 110,
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
  },
  imageContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'flex-start',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Offset de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Elevación en Android
  },
  messageText: {
    fontSize: 16,
    color: '#fff', // Color del texto dentro de las burbujas
  },
  addSpaceContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  addSpaceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
