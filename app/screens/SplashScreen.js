import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import logo from '../../assets/images/firstcl.png';

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigation.replace('Discover', { fromSplash: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" />
        <Image source={{ uri: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750875333/firstcl_t2bsco.png' }} style={styles.logo} />
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;