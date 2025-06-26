import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import useStore from '../store/useStore';

const { width } = Dimensions.get('window');

const MobileOTP = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  const { setPhoneNumber } = useStore();

  // Load custom font
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require('../../assets/fonts/Times New Roman.ttf'),
  });

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const isButtonDisabled = mobileNumber.length !== 10 || !isChecked || !validatePhoneNumber(mobileNumber);

  const handleContinue = () => {
    if (!isButtonDisabled) {
      setPhoneNumber(mobileNumber);
      navigation.navigate('OTPVerification', { mobileNumber });
    } else if (!validatePhoneNumber(mobileNumber)) {
      setError('Please enter a valid Indian mobile number starts with 6, 7, 8, or 9 ');
    }
  };

  const handleInputChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setMobileNumber(cleanedText);
    if (cleanedText.length === 10 && !validatePhoneNumber(cleanedText)) {
      setError('Please enter a valid Indian mobile number (starts with 6, 7, 8, or 9)');
    } else {
      setError('');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <TouchableOpacity style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Enter your mobile number{'\n'}to get OTP</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>(IN) +91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={mobileNumber}
            onChangeText={handleInputChange}
            maxLength={10}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isChecked && styles.checked]}
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms and Privacy Policy.</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.disabledButton]}
          onPress={handleContinue}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    paddingHorizontal: 20,
  },
  backArrowContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: '#222',
    lineHeight: 40,
    fontFamily: 'TimesNewRoman',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingBottom: 5,
    width: width * 0.8,
    justifyContent: 'center',
  },
  countryCode: {
    fontSize: 24,
    marginRight: 10,
    color: '#222',
    fontFamily: 'TimesNewRoman',
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: '#000',
    fontFamily: 'TimesNewRoman',
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#ff0000',
    marginBottom: 20,
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
    width: width * 0.8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: width * 0.8,
    justifyContent: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'TimesNewRoman',
  },
  termsText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'TimesNewRoman',
  },
  linkText: {
    color: '#333',
    textDecorationLine: 'underline',
    fontFamily: 'TimesNewRoman',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'TimesNewRoman',
  },
});

export default MobileOTP;