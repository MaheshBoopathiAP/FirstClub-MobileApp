import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
            source={{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRYbbMK0NYr-_rolxpQJDXR6Oreiq2akllSQ1tzXVdpBA2NPkJiOxMQDbWJbJH0sGgFFeyYjZ5rMH6XV3FBnTdZK1LpgejYNjmmTVP55A' }}
            style={styles.smallImage}
          />
          <Image
            source={{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRYbbMK0NYr-_rolxpQJDXR6Oreiq2akllSQ1tzXVdpBA2NPkJiOxMQDbWJbJH0sGgFFeyYjZ5rMH6XV3FBnTdZK1LpgejYNjmmTVP55A' }}
            style={styles.smallImage}
          />
        </View>

        <Image
          source={{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRYbbMK0NYr-_rolxpQJDXR6Oreiq2akllSQ1tzXVdpBA2NPkJiOxMQDbWJbJH0sGgFFeyYjZ5rMH6XV3FBnTdZK1LpgejYNjmmTVP55A' }}
          style={styles.largeImage}
        />

        <View style={styles.column}>
          <Image
            source={{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRYbbMK0NYr-_rolxpQJDXR6Oreiq2akllSQ1tzXVdpBA2NPkJiOxMQDbWJbJH0sGgFFeyYjZ5rMH6XV3FBnTdZK1LpgejYNjmmTVP55A' }}
            style={styles.smallImage}
          />
          <Image
            source={{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRYbbMK0NYr-_rolxpQJDXR6Oreiq2akllSQ1tzXVdpBA2NPkJiOxMQDbWJbJH0sGgFFeyYjZ5rMH6XV3FBnTdZK1LpgejYNjmmTVP55A' }}
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