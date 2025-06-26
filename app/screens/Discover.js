import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import useStore from '../store/useStore';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const Discover = ({ navigation }) => {
  const { isOtpValid } = useStore();

  const handleDiscover = () => {
    if (isOtpValid()) {
      navigation.navigate('ChooseLocation');
    } else {
      navigation.navigate('MobileOTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('ChooseLocation')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <Text style={styles.tagline}>
        Not just groceries. We{"\n"}bring you what matters.
      </Text>
      <View style={styles.imageRow}>
        <View style={styles.column}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750869507/image1_tbng91.avif' }}
            style={styles.smallImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750869508/image2_f9euvh.jpg' }}
            style={styles.smallImage}
            resizeMode="cover"
          />
        </View>
        <Image
          source={{ uri: 'https://res.cloudinary.com/deq5wxwiw/image/upload/f_auto,q_auto/v1750869507/image3_glurdo.jpg' }}
          style={styles.largeImage}
          resizeMode="cover"
        />
        <View style={styles.column}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/deq5wxwiw/image/upload/f_auto,q_auto/v1750869508/image4_nfjw9h.png' }}
            style={styles.smallImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: 'https://res.cloudinary.com/deq5wxwiw/image/upload/f_auto,q_auto/v1750869508/image5_kd3dpv.jpg' }}
            style={styles.smallImage}
            resizeMode="cover"
          />
        </View>
      </View>
      <Text style={styles.subtitle}>
        We’re not a marketplace with a sea of{"\n"}choices. Every item is something we’d{"\n"}give our own families
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleDiscover}>
        <Text style={styles.buttonText}>Discover</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6',
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 20
    // ...Platform.select({
    //   android: {
    //     paddingTop: 20,
    //   },
    // }),
  },
  skipButton: {
    marginTop: 10,
    position: 'absolute',
    right: 24,
    top: Dimensions.get('window').height * 0.05,
  },
  skipText: {
    fontSize: RFValue(16),
    color: '#000',
  },
  tagline: {
    marginTop: 30,
    fontSize: RFValue(30),
    fontWeight: '300',
    color: '#222',
    textAlign: 'center',
    lineHeight: RFValue(32),
    marginBottom: 50,
    fontSize: 32
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  smallImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 16,
    margin: 6,
  },
  largeImage: {
    width: width * 0.3,
    height: width * 0.4,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  subtitle: {
    fontSize: RFValue(14),
    color: '#444',
    textAlign: 'center',
    lineHeight: RFValue(22),
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
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default Discover;