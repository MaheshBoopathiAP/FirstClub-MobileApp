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
  AppState,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import useStore from '../store/useStore'; 

const { width } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 12.9384164,
  longitude: 77.6993338,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function ChooseLocationScreen({ navigation }) {
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const { setLocation, completeStep } = useStore();

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active' && locationPermission === false) {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === 'granted') {
            setLocationPermission(true);
            await getCurrentLocationWithFallback();
          }
        } catch (error) {
          console.error('App state change permission check error:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [locationPermission]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        setIsLoading(true);
        
        let { status: existingStatus } = await Location.getForegroundPermissionsAsync();
        console.log('Existing permission status:', existingStatus);
        
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          finalStatus = status;
          console.log('Permission request result:', status);
        }
        
        if (finalStatus === 'granted') {
          setLocationPermission(true);
          await getCurrentLocationWithFallback();
        } else if (finalStatus === 'denied') {
          console.log('Permission explicitly denied');
          setLocationPermission(false);
          showPermissionAlert('denied');
        } else if (finalStatus === 'undetermined') {
          console.log('Permission undetermined');
          setLocationPermission(false);
          showPermissionAlert('undetermined');
        } else {
          console.log('Permission status:', finalStatus);
          setLocationPermission(false);
          showPermissionAlert('other');
        }
      } catch (error) {
        console.error('Permission handling error:', error);
        setLocationPermission(false);
        showGenericError();
      } finally {
        setIsLoading(false);
      }
    };

    const showPermissionAlert = (type) => {
      let title, message, buttons;
      
      switch (type) {
        case 'denied':
          title = 'Location Access Denied';
          message = 'Location access has been denied. Please enable it in your device settings to use this feature.';
          buttons = [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ];
          break;
        case 'undetermined':
          title = 'Location Permission Required';
          message = 'This app needs location access to show nearby places. Please grant permission when prompted.';
          buttons = [
            { text: 'OK', onPress: () => requestLocationPermission() }
          ];
          break;
        default:
          title = 'Location Access Required';
          message = 'Please enable location access to use this feature.';
          buttons = [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ];
      }
      
      Alert.alert(title, message, buttons);
    };

    const showGenericError = () => {
      Alert.alert(
        'Location Error',
        'Unable to access location services. Please ensure location is enabled in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    };

    const getCurrentLocationWithFallback = async () => {
      const locationOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
        maximumAge: 10000,
      };

      let location;
      try {
        location = await Location.getCurrentPositionAsync(locationOptions);
        console.log('Successfully fetched current location:', location.coords);
      } catch (locationError) {
        console.error('Failed to get current location, using fallback:', locationError);
        
        const isSimulator = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV;
        
        if (isSimulator) {
          console.log('iOS Simulator detected, using default location');
          location = {
            coords: {
              latitude: DEFAULT_REGION.latitude,
              longitude: DEFAULT_REGION.longitude,
            }
          };
        } else {
          try {
            location = await Location.getLastKnownPositionAsync({
              maxAge: 300000,
              requiredAccuracy: 1000,
            });
            
            if (!location) {
              throw new Error('No last known position available');
            }
            console.log('Using last known position:', location.coords);
          } catch (fallbackError) {
            console.error('Last known position also failed:', fallbackError);
            location = {
              coords: {
                latitude: DEFAULT_REGION.latitude,
                longitude: DEFAULT_REGION.longitude,
              }
            };
            
            Alert.alert(
              'Location Notice',
              'Unable to get your exact location. Using default location (Bangalore). You can manually select your location on the map.',
              [{ text: 'OK' }]
            );
          }
        }
      }

      await processLocationData(location);
    };

    const processLocationData = async (location) => {
      const { latitude, longitude } = location.coords;
      
      const isSimulator = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV;
      const isOutsideIndia = latitude < 6 || latitude > 35 || longitude < 68 || longitude > 97;

      if (isSimulator && isOutsideIndia) {
        console.log('iOS Simulator with non-Indian location detected, using fallback');
        setSelectedLocation({
          latitude: DEFAULT_REGION.latitude,
          longitude: DEFAULT_REGION.longitude,
          address: 'Default Location (Bangalore)',
          city: 'Bangalore',
          subAddress: `Lat: ${DEFAULT_REGION.latitude.toFixed(4)}, Lon: ${DEFAULT_REGION.longitude.toFixed(4)}`,
          isServiceable: true,
        });
        
        setTimeout(() => {
          mapRef.current?.animateToRegion(DEFAULT_REGION, 500);
        }, 1000);
        return;
      }

      try {
        const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        if (addressData && addressData.length > 0) {
          const addr = addressData[0];
          const address = addr?.name || addr?.street || addr?.district || 'Current Location';
          const city = addr?.city || addr?.subregion || addr?.region || 'Unknown City';
          const subAddress = addr?.street || addr?.district || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setSelectedLocation({
            latitude,
            longitude,
            address,
            city,
            subAddress,
            isServiceable: true,
          });
        } else {
          throw new Error('No address data returned');
        }
      } catch (reverseGeocodeError) {
        console.error('Reverse geocoding failed:', reverseGeocodeError);
        setSelectedLocation({
          latitude,
          longitude,
          address: 'Selected Location',
          city: 'Unknown',
          subAddress: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          isServiceable: true,
        });
      }
      
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 500);
      }, 1000);
    };

    requestLocationPermission();
  }, []);

  const processLocationFromCoords = async (coords) => {
    const { latitude, longitude } = coords;
    
    try {
      const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      const addr = addressData[0];
      const address = addr?.name || addr?.street || addr?.district || 'Current Location';
      const city = addr?.city || addr?.subregion || addr?.region || 'Unknown';
      const subAddress = addr?.street || addr?.district || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      setSelectedLocation({
        latitude,
        longitude,
        address,
        city,
        subAddress,
        isServiceable: true,
      });

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    } catch (error) {
      console.error('Process location coords error:', error);
      setSelectedLocation({
        latitude,
        longitude,
        address: 'Current Location',
        city: 'Unknown',
        subAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        isServiceable: true,
      });
    }
  };

  const handleMapPress = async (event) => {
    try {
      const { coordinate } = event.nativeEvent;
      const addressData = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
      
      const address = addressData[0]?.name || addressData[0]?.street || 'Selected Location';
      const city = addressData[0]?.city || addressData[0]?.subregion || 'Unknown';
      const subAddress = addressData[0]?.street || `Lat: ${coordinate.latitude.toFixed(4)}, Lon: ${coordinate.longitude.toFixed(4)}`;

      Alert.alert(
        'Confirm Location',
        `Use this location: ${address}, ${city}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => {
              setSelectedLocation({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                address,
                city,
                subAddress,
                isServiceable: true,
              });
              mapRef.current?.animateToRegion({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }, 300);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Map press error:', error);
      Alert.alert('Error', 'Failed to get location details');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search Error', 'Please enter a location to search');
      return;
    }
    
    try {
      setIsSearching(true);
      const results = await Location.geocodeAsync(searchQuery);
      
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        
        try {
          const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
          const address = addressData[0]?.name || addressData[0]?.street || searchQuery;
          const city = addressData[0]?.city || addressData[0]?.subregion || 'Unknown';
          const subAddress = addressData[0]?.street || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

          setSelectedLocation({
            latitude,
            longitude,
            address,
            city,
            subAddress,
            isServiceable: true,
          });
          
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }, 500);
          
          setSearchQuery(''); 
        } catch (reverseGeocodeError) {
          console.error('Reverse geocode error during search:', reverseGeocodeError);
          setSelectedLocation({
            latitude,
            longitude,
            address: searchQuery,
            city: 'Unknown',
            subAddress: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
            isServiceable: true,
          });
        }
      } else {
        Alert.alert('No Results', 'No location found for the entered address. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search Error:', error);
      Alert.alert('Search Error', 'Failed to search location. Please check your internet connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDragEnd = async (event) => {
    try {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      
      const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = addressData[0]?.name || addressData[0]?.street || 'Selected Location';
      const city = addressData[0]?.city || addressData[0]?.subregion || 'Unknown';
      const subAddress = addressData[0]?.street || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

      setSelectedLocation({
        latitude,
        longitude,
        address,
        city,
        subAddress,
        isServiceable: true, 
      });
    } catch (error) {
      console.error('Drag end error:', error);
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedLocation({
        latitude,
        longitude,
        address: 'Selected Location',
        city: 'Unknown',
        subAddress: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
        isServiceable: true,
      });
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to use this feature. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      setIsGettingCurrentLocation(true);

      const locationOptions = {
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 5000,
      };

      try {
        const location = await Location.getCurrentPositionAsync(locationOptions);
        await processLocationFromCoords(location.coords);
      } catch (locationError) {
        console.error('Current location fetch failed:', locationError);
        
        try {
          const lastLocation = await Location.getLastKnownPositionAsync({
            maxAge: 300000, // 5 minutes
            requiredAccuracy: 1000,
          });
          
          if (lastLocation) {
            await processLocationFromCoords(lastLocation.coords);
            Alert.alert(
              'Location Notice',
              'Using your last known location as current location could not be determined.',
              [{ text: 'OK' }]
            );
          } else {
            throw new Error('No location available');
          }
        } catch (fallbackError) {
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error('Handle current location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please ensure location services are enabled and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  const handleNext = () => {
    if (selectedLocation?.isServiceable) {
      setLocation({ 
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: selectedLocation.address,
        city: selectedLocation.city,
      });
      completeStep(1);
      navigation.navigate('Preference');
    } else {
      Alert.alert('Error', 'Please select a serviceable location');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Location</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#563314" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  if (locationPermission === false) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Location</Text>
        </View>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="map-marker-off" size={64} color="#ccc" />
          <Text style={styles.errorText}>
            Location access is required to use this feature. Please enable it in settings to continue.
          </Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsBtnText}>Open Settings</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>or</Text>
          
          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: '#28a745' }]}
            onPress={() => {
              // Set default location as fallback
              setSelectedLocation({
                latitude: DEFAULT_REGION.latitude,
                longitude: DEFAULT_REGION.longitude,
                address: 'Default Location (Bangalore)',
                city: 'Bangalore',
                subAddress: 'BTM Layout, Bangalore',
                isServiceable: true,
              });
              setLocationPermission(true);
            }}
          >
            <Text style={styles.settingsBtnText}>Use Default Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!selectedLocation) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Location</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#563314" />
          <Text style={styles.loadingText}>Loading location...</Text>
        </View>
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
            placeholder="Search for area, street name..."
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
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomEnabled={true}
        scrollEnabled={true}
        loadingEnabled={true}
        showsCompass={true}
        showsScale={true}
      >
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
            <Text style={styles.addrSub}>{selectedLocation.city}, {selectedLocation.subAddress}</Text>
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
          <Text style={[
            styles.nextBtnTxt,
            !selectedLocation?.isServiceable && styles.nextBtnTxtDisabled
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#563314',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 14,
    fontWeight: '600',
  },
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
  searchLabel: { 
    fontSize: 12, 
    color: '#777', 
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
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
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#333',
    paddingVertical: 0,
  },
  map: { 
    flex: 1 
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  calloutTxt: {
    fontSize: 12,
    color: '#333',
    flexShrink: 1,
    lineHeight: 16,
  },
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
  bottomHeader: { 
    fontSize: 12, 
    color: '#777', 
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
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
  addrTitle: { 
    fontWeight: '700', 
    fontSize: 15, 
    color: '#333',
    marginBottom: 2,
  },
  addrSub: { 
    fontSize: 13, 
    color: '#666',
    lineHeight: 18,
  },
  unservTxt: { 
    fontSize: 12, 
    color: '#dc3545',
    fontWeight: '600',
  },
  nextBtn: {
    height: 46,
    borderRadius: 8,
    backgroundColor: '#563314',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#eee',
  },
  nextBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsBtn: {
    backgroundColor: '#563314',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});