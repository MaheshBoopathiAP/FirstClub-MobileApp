import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import useStore from '../store/useStore';

const OTPVerification = ({ navigation, route }) => {
  const [otp, setLocalOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(28);
  const { mobileNumber } = route.params || {};
  const { setOtp, completeStep } = useStore();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity
        style={styles.backArrowContainer}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Please enter the OTP</Text>
      <Text style={styles.instruction}>
        Enter the OTP sent to +91-{mobileNumber || 'xxxxxxxxxx'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="_ _ _ _"
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backArrowContainer: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333333',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 20,
    marginBottom: 20,
    color: '#333333',
  },
  retryText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default OTPVerification;