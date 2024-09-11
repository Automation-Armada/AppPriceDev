import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDimensions, widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import backIcon from '../assets/back.png';

const ConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri } = route.params || {};

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={backIcon} style={styles.backButtonImage} />
      </TouchableOpacity>

      <Text style={styles.header}>Confirmar Fotografía</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text>No hay imagen para mostrar</Text>
      )}

      <TouchableOpacity style={styles.consultButton} onPress={() => { /* Lógica para consultar */ }}>
        <Text style={styles.consultButtonText}>Consultar</Text>
      </TouchableOpacity>
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp('100%'),
    height: hp('100%'),
  },
  backButton: {
    position: 'absolute',
    top: hp('3%'),
    left: wp('5%'),
    zIndex: 1,
  },
  backButtonImage: {
    width: wp('10%'),
    height: hp('5%'),
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  image: {
    width: wp('80%'),
    height: hp('50%'),
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: hp('2%'),
  },
  consultButton: {
    backgroundColor: 'green',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('6%'),
    borderRadius: 10,
  },
  consultButtonText: {
    color: 'white',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
