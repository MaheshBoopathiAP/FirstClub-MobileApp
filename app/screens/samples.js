import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const samples = [
  {
    id: 1,
    name: 'A2 Cow Milk',
    sub: 'GRASS-FED COWS',
    image: 'data:image/jpeg;base64,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',
    badge: 'Milked 5 hrs ago',
  },
  {
    id: 2,
    name: 'Cookie Hamper',
    sub: 'By YuvaFlowers',
    image:
      'https://www.yuvaflowers.com/cdn/shop/files/cookies-with-dairy-milk-chocolates-hamper-manual-yuvaflowers-bestgifts-978-default-title-42166831218968.jpg?v=1711900809',
    badge: 'Sourced 5 hrs ago',
  },
];

export default function SamplesScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleNext = () => {
    if (navigation) navigation.navigate('Home');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      
      <ImageBackground
        source={{
          uri: 'https://res.cloudinary.com/dwfadsgpb/image/upload/v1750786446/ChatGPT_Image_Jun_24_2025_11_02_50_PM_g1emvg.jpg',
        }}
        style={styles.bgTop}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', '#f4f3e8']}
          style={styles.gradient}
        />
      </ImageBackground>

      <TouchableOpacity style={styles.skip} onPress={handleNext}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>The cleanest pantry{'\n'}you’ll ever build.</Text>
      </View>

  
      <View style={styles.cardsWrap}>
        <FlatList
          data={samples}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.72}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          renderItem={({ item }) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity onPress={() => handleSelect(item.id)} style={styles.card}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>⚙ {item.badge}</Text>
                </View>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{item.sub}</Text>
                <View style={styles.row}>
                  <Text style={styles.sampleText}>Free Sample</Text>
                  <Text style={styles.volumeText}>250ml</Text>
                  <TouchableOpacity style={styles.plusBtn}>
                    <Text style={styles.plusText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <Text style={styles.italicQuote}>
        “gentle on your gut, and bottled in glass to{'\n'}keep it just as nature intended”
      </Text>

      <View style={styles.iconRow}>
        <View style={styles.iconBlock}>
          <Text style={styles.icon}>💊</Text>
          <Text style={styles.iconLabel}>No{'\n'}Antibiotics</Text>
        </View>
        <View style={styles.iconBlock}>
          <Text style={styles.icon}>🌿</Text>
          <Text style={styles.iconLabel}>Sustainably{'\n'}Sourced</Text>
        </View>
        <View style={styles.iconBlock}>
          <Text style={styles.icon}>💉</Text>
          <Text style={styles.iconLabel}>No{'\n'}Hormones</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, !selectedId && { backgroundColor: '#ccc' }]}
        onPress={handleNext}
        disabled={!selectedId}
      >
        <Text style={styles.nextText}>Next ➜</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4f3e8',
  },
  bgTop: {
    height: height * 0.5,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  skip: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#000',
  },
  titleWrap: {
    marginTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginTop:30,
    lineHeight: 36,
  },
  cardsWrap: {
    flex: 1,
    justifyContent: 'center',
    

  },
  carousel: {
    paddingHorizontal: 10,
    height:500,
    paddingTop:50

  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 250,
    height:400,
    marginHorizontal: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  badge: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#444',
  },
  productImage: {
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#222',
  },
  sub: {
    fontSize: 12,
    textAlign: 'center',
    color: '#777',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sampleText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  volumeText: {
    color: '#666',
    fontSize: 14,
  },
  plusBtn: {
    backgroundColor: '#0a0a0a',
    borderRadius: 999,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  plusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  italicQuote: {
    fontStyle: 'italic',
    fontSize: 17,
    textAlign: 'center',
    color: '#444',
    marginBottom: 40,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  iconBlock: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  nextBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
