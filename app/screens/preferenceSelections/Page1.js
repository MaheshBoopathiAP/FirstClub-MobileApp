import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const OPTIONS = [
  'Just me',
  'Me & my partner',
  'Family with kids',
  'Elders at home',
  'Pets',
];

const Page1 = ({ navigation }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const isSelected = (option) => selectedOptions.includes(option);

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      navigation.navigate('PreferencePage2');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar style="dark" />
      <View style={styles.container}>
       
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Fresh means today,{"\n"}not last week.</Text>

        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046750.png' }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.description}>
          Our produce doesn't sit in warehouses. It's sourced with care and delivered with speed — so your kitchen stays fresh, always.
        </Text>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '33%' }]} />
        </View>

        <Text style={styles.question}>Who are you usually shopping for?</Text>

        <View style={styles.optionsContainer}>
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, isSelected(option) && styles.optionSelected]}
              onPress={() => toggleOption(option)}
            >
              <Text style={[styles.optionText, isSelected(option) && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedOptions.length === 0 && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={selectedOptions.length === 0}
          >
            <Text style={styles.nextButtonText}>Next ➔</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fdfaf6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingBottom: 80,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    top: Platform.OS === 'android' ? 60 : 80,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    lineHeight: Platform.OS === 'android' ? 32 : 28,
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 70,
    alignSelf: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: Platform.OS === 'android' ? 24 : 22,
    marginBottom: 50,
    paddingHorizontal: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 16,
    textAlign: 'left',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 40,
    paddingHorizontal: 4,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
    minWidth: 100,
  },
  optionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
    paddingVertical: 12,
  },
  nextButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#000',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Page1;