import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  AppState,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import useStore from '../store/useStore';

const { width } = Dimensions.get('window');
const LOCATION_FETCH_TIMEOUT = 15000;
const DEFAULT_REGION = {
  latitude: 12.9384164,
  longitude: 77.6993338,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function ChooseLocationScreen({ navigation }) {
  const mapRef = useRef(null);
  const timeoutRef = useRef(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const { setLocation, completeStep } = useStore();

  const useFallbackLocation = useCallback(() => {
    const fallback = {
      latitude: DEFAULT_REGION.latitude,
      longitude: DEFAULT_REGION.longitude,
      address: 'Default Location (Bangalore)',
      city: 'Bangalore',
      subAddress: 'BTM Layout, Bangalore',
      isServiceable: true,
    };
    setSelectedLocation(fallback);
    mapRef.current?.animateToRegion(DEFAULT_REGION, 500);
  }, []);

  const handleSkip = useCallback(() => {
    useFallbackLocation();
    setLocation({
      latitude: DEFAULT_REGION.latitude,
      longitude: DEFAULT_REGION.longitude,
      address: 'Default Location (Bangalore)',
      city: 'Bangalore',
    });
    completeStep(1);
    navigation.navigate('Preference');
  }, [completeStep, navigation, setLocation, useFallbackLocation]);

  const safeAlert = (title, message, buttons = [{ text: 'OK' }]) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message, buttons, { cancelable: true });
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      try {
        setIsLoading(true);
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          setLocationPermission(false);
          setIsLoading(false);
          safeAlert('Location Services Disabled', 'Enable location services or use Skip.', [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'OK' },
          ]);
          return;
        }
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const res = await Location.requestForegroundPermissionsAsync();
          status = res.status;
        }
        setLocationPermission(status === 'granted');
        if (status === 'granted') {
          await getCurrentLocationWithFallback();
        } else {
          safeAlert('Permission Denied', 'Grant location permission or use Skip.', [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'OK' },
          ]);
          useFallbackLocation();
        }
      } catch (err) {
        console.error(err);
        safeAlert('Location Error', 'Unexpected error.', [{ text: 'OK' }]);
        useFallbackLocation();
      } finally {
        setIsLoading(false);
      }
    };
    requestPermission();
  }, [useFallbackLocation]);

  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          safeAlert('Location Timeout', 'Fetching location took too long. Try again or use Skip.', [
            { text: 'Try Again', onPress: () => getCurrentLocationWithFallback() },
            { text: 'OK' },
          ]);
          setIsLoading(false);
        }
      }, LOCATION_FETCH_TIMEOUT);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isLoading]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active' && locationPermission === false) {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          await getCurrentLocationWithFallback();
        }
      }
    });
    return () => sub.remove();
  }, [locationPermission]);

  const processLocationData = async coords => {
    const { latitude, longitude } = coords;
    try {
      const [addr = {}] = await Location.reverseGeocodeAsync({ latitude, longitude });
      setSelectedLocation({
        latitude,
        longitude,
        address: addr.name || addr.street || addr.district || 'Selected Location',
        city: addr.city || addr.subregion || addr.region || 'Unknown',
        subAddress: addr.street || addr.district || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        isServiceable: true,
      });
    } catch (err) {
      console.error(err);
      setSelectedLocation({
        latitude,
        longitude,
        address: 'Selected Location',
        city: 'Unknown',
        subAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        isServiceable: true,
      });
    } finally {
      mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 500);
    }
  };

  const getCurrentLocationWithFallback = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await processLocationData(loc.coords);
    } catch (err) {
      console.warn(err);
      try {
        const last = await Location.getLastKnownPositionAsync({ maxAge: 300000, requiredAccuracy: 1000 });
        if (last) {
          await processLocationData(last.coords);
        } else {
          throw new Error('No last known position');
        }
      } catch (e) {
        safeAlert('Location Unavailable', 'Using default location.', [{ text: 'OK' }]);
        useFallbackLocation();
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      safeAlert('Search Error', 'Enter a location to search.');
      return;
    }
    try {
      setIsSearching(true);
      const [result] = await Location.geocodeAsync(searchQuery);
      if (result) {
        await processLocationData(result);
        setSearchQuery('');
      } else {
        safeAlert('No Results', 'No location found.');
      }
    } catch (err) {
      console.error(err);
      safeAlert('Search Error', 'Failed to search location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapPress = async e => {
    const { coordinate } = e.nativeEvent;
    try {
      const [addr = {}] = await Location.reverseGeocodeAsync(coordinate);
      const address = addr.name || addr.street || 'Selected Location';
      const city = addr.city || addr.subregion || 'Unknown';
      Alert.alert('Confirm Location', `${address}, ${city}`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => processLocationData(coordinate) },
      ]);
    } catch (err) {
      console.error(err);
      safeAlert('Error', 'Failed to get location details');
    }
  };

  const handleDragEnd = async e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    await processLocationData({ latitude, longitude });
  };

  const handleCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);
    await getCurrentLocationWithFallback();
    setIsGettingCurrentLocation(false);
  };

  const handleNext = () => {
    if (!selectedLocation?.isServiceable) {
      safeAlert('Location Required', 'Select a serviceable location or Skip.');
      return;
    }
    setLocation({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address,
      city: selectedLocation.city,
    });
    completeStep(1);
    navigation.navigate('Preference');
  };

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Header navigation={navigation} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#563314" />
          <Text style={styles.loadingText}>Getting your location…</Text>
          <TouchableOpacity style={styles.skipInlineBtn} onPress={handleSkip}>
            <Ionicons name="md-arrow-forward" size={16} color="#fff" />
            <Text style={styles.skipInlineText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header navigation={navigation} />

      <View style={styles.searchWrap}>
        <Text style={styles.searchLabel}>TYPE LOCATION</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Search for area, street name…"
            placeholderTextColor="#999"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            editable={!isSearching}
          />
          <TouchableOpacity onPress={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="search-outline" size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        initialRegion={
          selectedLocation
            ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : DEFAULT_REGION
        }
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
        zoomEnabled
        scrollEnabled
        loadingEnabled
        showsCompass
        showsScale
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            draggable
            onDragEnd={handleDragEnd}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location-sharp" size={32} color="#563314" />
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <MaterialCommunityIcons
                  name={selectedLocation.isServiceable ? 'check-circle' : 'close-circle'}
                  color={selectedLocation.isServiceable ? '#28a745' : '#dc3545'}
                  size={16}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.calloutTxt}>
                  {selectedLocation.address}, {selectedLocation.city}
                  {'\n'}
                  {selectedLocation.isServiceable ? 'Service Available' : 'Service Not Available'}
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        style={styles.currentLocationBtn}
        onPress={handleCurrentLocation}
        disabled={isGettingCurrentLocation}
      >
        {isGettingCurrentLocation ? (
          <ActivityIndicator size="small" color="#563314" />
        ) : (
          <Ionicons name="locate" size={24} color="#563314" />
        )}
      </TouchableOpacity>

      {selectedLocation && (
        <View style={styles.bottomCard}>
          <Text style={styles.bottomHeader}>SELECTED LOCATION</Text>

          <View style={styles.addrRow}>
            <MaterialCommunityIcons
              name={selectedLocation.isServiceable ? 'check-circle' : 'close-circle'}
              size={20}
              color={selectedLocation.isServiceable ? '#28a745' : '#dc3545'}
            />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={styles.addrTitle}>{selectedLocation.address}</Text>
              <Text style={styles.addrSub}>
                {selectedLocation.city}, {selectedLocation.subAddress}
              </Text>
            </View>
            {!selectedLocation.isServiceable && (
              <>
                <MaterialCommunityIcons name="cancel" size={16} color="red" style={{ marginHorizontal: 8 }} />
                <Text style={styles.unservTxt}>Not Available</Text>
              </>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              disabled={!selectedLocation.isServiceable}
              style={[styles.nextBtn, !selectedLocation.isServiceable && styles.nextBtnDisabled]}
              onPress={handleNext}
            >
              <Text style={[styles.nextBtnTxt, !selectedLocation.isServiceable && styles.nextBtnTxtDisabled]}>
                Next
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation?.goBack()}>
      <Ionicons name="arrow-back" size={26} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Choose Location</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#563314',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: { color: '#fff', fontSize: 20, marginLeft: 14, fontWeight: '600' },
  searchWrap: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  searchLabel: { fontSize: 12, color: '#777', marginBottom: 6, fontWeight: '500', letterSpacing: 0.5 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fafafa',
  },
  input: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 0 },
  mapStyle: { flex: 1 },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  currentLocationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#eee',
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 220,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  calloutTxt: { fontSize: 12, color: '#333', flexShrink: 1, lineHeight: 16 },
  bottomCard: {
    width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  bottomHeader: { fontSize: 12, color: '#777', marginBottom: 12, fontWeight: '600', letterSpacing: 0.5 },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  addrTitle: { fontWeight: '700', fontSize: 15, color: '#333', marginBottom: 2 },
  addrSub: { fontSize: 13, color: '#666', lineHeight: 18 },
  unservTxt: { fontSize: 12, color: '#dc3545', fontWeight: '600' },
  nextBtn: { height: 48, borderRadius: 8, backgroundColor: '#563314', justifyContent: 'center', alignItems: 'center', flex: 1, marginRight: 8 },
  nextBtnDisabled: { backgroundColor: '#eee' },
  nextBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
  nextBtnTxtDisabled: { color: '#999' },
  skipBtn: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#1e7e34',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  skipBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { fontSize: 16, color: '#333', textAlign: 'center', marginTop: 12 },
  skipInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#28a745',
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  skipInlineText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 6 },
});
