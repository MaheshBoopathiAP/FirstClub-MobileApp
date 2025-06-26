import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

const OTPVerification = ({ navigation, route }) => {
  const [otp, setLocalOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(25);
  const { mobileNumber } = route.params || {};
  const { setOtp, completeStep } = useStore();

  // Load custom font
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require('../../assets/fonts/Times New Roman.ttf'),
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Wait for fonts to load
  if (!fontsLoaded) {
    return null;
  }

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `00:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      setOtp(otp); // Store OTP in Zustand
      completeStep(0); // Complete "Login" step
      navigation.navigate('ChooseLocation');
    }
  };

  const buttonStyle = {
    ...styles.button,
    backgroundColor: otp.length < 6 ? '#ccc' : '#000',
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <TouchableOpacity
        style={styles.backArrowContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#333333" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Please enter the OTP</Text>
        <Text style={styles.instruction}>
          Enter the OTP sent to +91-{mobileNumber || 'xxxxxxxxxx'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="_ _ _ _ _ _"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setLocalOtp}
          maxLength={6}
        />
        <Text style={styles.retryText}>
          Didn't receive OTP? Retry in {formatTime()}
        </Text>
        <TouchableOpacity
          style={buttonStyle}
          disabled={otp.length < 6}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    paddingHorizontal: 16,
  },
  backArrowContainer: {
    position: 'absolute',
    top: 40,
    left: 16,
    marginTop: 20,
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
    fontFamily: 'TimesNewRoman',
    width: width * 0.8,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 30,
    fontFamily: 'TimesNewRoman',
    width: width * 0.8,
  },
  input: {
    width: width * 0.8,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 30,
    color: '#333333',
    fontFamily: 'TimesNewRoman',
    paddingVertical: 10,
  },
  retryText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'TimesNewRoman',
    width: width * 0.8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: width * 0.8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
  },
});

export default OTPVerification;