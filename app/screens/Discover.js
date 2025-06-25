import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import img1 from '../../assets/images/DiscoverPage/image1.jpg'
import img2 from '../../assets/images/DiscoverPage/image2.jpeg'
import img3 from '../../assets/images/DiscoverPage/image3.jpg'
import img4 from '../../assets/images/DiscoverPage/image4.jpg'
import img5 from '../../assets/images/DiscoverPage/image5.jpg'

const Discover = ({ navigation, route }) => {
  const handleDiscover = () => {
    const { fromSplash, fromNextMap } = route.params || {};
    if (fromSplash) {
      navigation.navigate('MobileOTP');
    } else if (fromNextMap) {
      navigation.navigate('Preference');
    } else {
      navigation.navigate('MobileOTP'); 
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.tagline}>
        Not just groceries. We{"\n"}bring you what matters.
      </Text>

      <View style={styles.imageRow}>
        <View style={styles.column}>
          <Image
            source={img1}
            style={styles.smallImage}
          />
          <Image
            source={img2}
            style={styles.smallImage}
          />
        </View>

        <Image
          source={img3}
          style={styles.largeImage}
        />

        <View style={styles.column}>
          <Image
            source={img4}
            style={styles.smallImage}
          />
          <Image
            source={img5}
            style={styles.smallImage}
          />
        </View>
      </View>

      <Text style={styles.subtitle}>
        We’re not a marketplace with a sea of{"\n"}choices. Every item is something we’d{"\n"}give our own families
      </Text>


      <TouchableOpacity style={styles.button} onPress={handleDiscover}>
        <Text style={styles.buttonText}>Discover</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6',
    paddingTop: 180,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    top: 60,
  },
  skipText: {
    fontSize: 16,
    color: '#000',
  },
  tagline: {
    fontSize: 30,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 100,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 16,
  },
  smallImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    margin: 6,
  },
  largeImage: {
    width: 120,
    height: 160,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Discover;