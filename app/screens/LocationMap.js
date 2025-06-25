import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const { width } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 12.9384164, 
  longitude: 77.6993038,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function ChooseLocationScreen({ navigation }) {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to use this feature.',
          [
            { text: 'OK', onPress: () => console.log('Permission denied') },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        setLocationPermission(false);
        return;
      }
      setLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({});
      console.log('Fetched Location:', location.coords);

      const isSimulator = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV;
      const isOutsideIndia = location.coords.latitude < 6 || location.coords.latitude > 35 ||
                            location.coords.longitude < 68 || location.coords.longitude > 97;

      if (isSimulator && isOutsideIndia) {
        console.log('iOS Simulator detected with non-Indian location, using fallback');
        setSelectedLocation({
          latitude: DEFAULT_REGION.latitude,
          longitude: DEFAULT_REGION.longitude,
          address: 'Mock Bangalore Location',
          subAddress: `Lat: ${DEFAULT_REGION.latitude.toFixed(4)}, Lon: ${DEFAULT_REGION.longitude.toFixed(4)}`,
          isServiceable: true, 
        });
        mapRef.current?.animateToRegion(DEFAULT_REGION, 500);
      } else {
        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: 'Current Location',
          subAddress: `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`,
          isServiceable: location.coords.latitude > 12.9 && location.coords.longitude > 77.6,
        });
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 500);
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: 'Selected Location',
      subAddress: `Lat: ${coordinate.latitude.toFixed(4)}, Lon: ${coordinate.longitude.toFixed(4)}`,
      isServiceable: coordinate.latitude > 12.9 && coordinate.longitude > 77.6,
    });
    mapRef.current.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.latitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 500);
  };

  const handleNext = () => {
    if (selectedLocation?.isServiceable) {
      navigation.navigate('NextMapForm'); 
    }
  };

  if (locationPermission === null) {
    return (
      <View style={styles.root}>
        <Text style={styles.loadingText}>Requesting location permission...</Text>
      </View>
    );
  }

  if (!locationPermission || !selectedLocation) {
    return (
      <View style={styles.root}>
        <Text style={styles.errorText}>
          Location access is required to use this feature. Please enable it in settings.
        </Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.settingsBtnText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Location</Text>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchLabel}>TYPE LOCATION</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="BTM Layout"
            placeholderTextColor="#333"
            style={styles.input}
            onChangeText={(text) => {
              console.log('Search:', text);
            }}
          />
          <Ionicons name="search-outline" size={18} color="#666" />
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={selectedLocation}>
          <Ionicons name="location-sharp" size={32} color="#2ac" />
          <Callout tooltip>
            <View style={styles.callout}>
              <MaterialCommunityIcons
                name={selectedLocation.isServiceable ? 'check-circle' : 'close-circle'}
                color={selectedLocation.isServiceable ? '#28a745' : '#dc3545'}
                size={16}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.calloutTxt}>
                {selectedLocation.isServiceable
                  ? 'Available'
                  : 'Not Available'}
              </Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={styles.bottomHeader}>SELECTED LOCATION</Text>

        <View style={styles.addrRow}>
          <MaterialCommunityIcons
            name={selectedLocation.isServiceable ? 'check-circle' : 'close-circle'}
            size={16}
            color={selectedLocation.isServiceable ? '#28a745' : '#dc3545'}
          />
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Text style={styles.addrTitle}>{selectedLocation.address}</Text>
            <Text style={styles.addrSub}>{selectedLocation.subAddress}</Text>
          </View>
          {!selectedLocation.isServiceable && (
            <>
              <MaterialCommunityIcons
                name="cancel"
                size={16}
                color="red"
                style={{ marginHorizontal: 4 }}
              />
              <Text style={styles.unservTxt}>Not Available</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          disabled={!selectedLocation?.isServiceable}
          style={[
            styles.nextBtn,
            !selectedLocation?.isServiceable && styles.nextBtnDisabled,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnTxt}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#563314',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 14,
    fontWeight: '500',
  },
  searchWrap: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  searchLabel: { fontSize: 12, color: '#777', marginBottom: 4 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 42,
  },
  input: { flex: 1, fontSize: 15, color: '#000' },
  map: { flex: 1 },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e00',
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    width: 150,
  },
  calloutTxt: { 
    fontSize: 12,
    color: '#000',
  },
  bottomCard: {
    width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  bottomHeader: { fontSize: 12, color: '#777', marginBottom: 10 },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  addrTitle: { fontWeight: '700', fontSize: 14, color: '#000' },
  addrSub: { fontSize: 12, color: '#555' },
  unservTxt: { fontSize: 12, color: 'red' },
  nextBtn: {
    height: 46,
    borderRadius: 8,
    backgroundColor: '#d2c2a4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#eee',
  },
  nextBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: '50%',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: '40%',
    paddingHorizontal: 20,
  },
  settingsBtn: {
    backgroundColor: '#d2c2a4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  settingsBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});