import React, { useState } from 'react';
import useStore from '../store/useStore';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const horizontalPadding = 20;
const fieldWidth = width - 2 * horizontalPadding;

export default function NextMapScreen({ navigation }) {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [directionInstructions, setDirectionInstructions] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressTag, setAddressTag] = useState('');
  const { completeOnboarding } = useStore();

  const handleNext = () => {
    if (addressLine1 && addressLine2 && city && state && pincode && addressTag) {
      completeOnboarding();
      navigation.navigate('Discover', { fromNextMap: true });
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Details</Text>
      </View>

      {/* Scrollable Form */}
      <View style={styles.scrollWrapper}>
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Address Line1"
              value={addressLine1}
              onChangeText={setAddressLine1}
              placeholderTextColor="#aaa"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Address Line2"
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Delivery Instructions"
            value={directionInstructions}
            onChangeText={setDirectionInstructions}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={state}
            onChangeText={setState}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Address Tags:</Text>
          <View style={styles.tagContainer}>
            {['Home', 'Friends', 'Office', 'Others'].map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagButton, addressTag === tag && styles.tagButtonSelected]}
                onPress={() => setAddressTag(tag)}
              >
                <Text style={[
                  styles.tagButtonText,
                  addressTag === tag && styles.tagButtonTextSelected,
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.compulsoryText}>* Compulsory Fields</Text>

          <TouchableOpacity
            style={[
              styles.nextButton,
              !(addressLine1 && addressLine2 && city && state && pincode && addressTag) &&
              styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={
              !(addressLine1 && addressLine2 && city && state && pincode && addressTag)
            }
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#563314',
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingTop: 50,
    height: 100,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: '#f5f2e7',
  },
  formContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 60,
  },
  searchInputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  searchInput: {
    width: fieldWidth,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  input: {
    width: fieldWidth,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    width: fieldWidth,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: fieldWidth,
  },
  tagButton: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  tagButtonSelected: {
    backgroundColor: '#efe4d3',
    borderColor: '#c7b89d',
  },
  tagButtonText: {
    fontSize: 14,
    color: '#333',
  },
  tagButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  compulsoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginVertical: 8,
    fontStyle: 'italic',
    width: fieldWidth,
  },
  nextButton: {
    width: fieldWidth,
    backgroundColor: '#563314',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  nextButtonDisabled: {
    backgroundColor: '#d4d4d4',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});