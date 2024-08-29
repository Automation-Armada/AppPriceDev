// // screens/SplashScreen.js
// import React, { useEffect } from 'react';
// import { View, StyleSheet, Image } from 'react-native';
// import colors from '../constants/colors';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('Home'); // Navega a la pantalla principal después de 3 segundos
//     }, 3000); // Ajusta la duración según sea necesario (en milisegundos)

//     return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonta
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../assets/logo.png')} // Ruta al archivo de tu logo
//         style={styles.logo}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center', // Centra el logo verticalmente
//     alignItems: 'center', // Centra el logo horizontalmente
//     backgroundColor: colors.background,
//   },
//   logo: {
//     width: 150, // Ajusta el tamaño del logo según sea necesario
//     height: 150,
//     resizeMode: 'contain',
//   },
// });

// export default SplashScreen;
