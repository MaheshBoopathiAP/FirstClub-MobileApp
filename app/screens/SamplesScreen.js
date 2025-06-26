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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const samples = [
  {
    id: 1,
    name: 'A2 Cow Milk',
    sub: 'GRASS-FED COWS',
    image: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750868323/image-milk-bottle_vwyukg.jpg',
    badge: 'Milked 5 hrs ago',
  },
  {
    id: 2,
    name: 'Cookie Hamper',
    sub: 'By YuvaFlowers',
    image: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750868427/chocolate_totgip.jpg',
    badge: 'Packed 3 hrs ago',
  },
  {
    id: 3,
    name: 'Fresh Tomatoes',
    sub: 'Farm Fresh Batch',
    image: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750868767/tomatoes1_oa1hee.jpg',
    badge: 'Harvested 6 hrs ago',
  },
  {
    id: 4,
    name: 'Organic Apples',
    sub: 'Himalayan Orchards',
    image: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750868653/apple_n0cfxc.jpg',
    badge: 'Sourced 4 hrs ago',
  },
  {
    id: 5,
    name: 'Juicy Oranges',
    sub: 'Nagpur Farms',
    image: 'https://res.cloudinary.com/deq5wxwiw/image/upload/v1750868717/oranges_awz9ui.jpg',
    badge: 'Picked Today',
  },
];

export default function SamplesScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleNext = () => {
    if (navigation) navigation.navigate('Splash');
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

      {/* <TouchableOpacity style={styles.skip} onPress={handleNext}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity> */}

      <View style={styles.titleWrap}>
        <Text style={styles.title}>The cleanest pantry{'\n'}you’ll ever build.</Text>
      </View>

      <View style={styles.cardsWrap}>
        <FlatList
          data={samples}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.65 + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          renderItem={({ item }) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity onPress={() => handleSelect(item.id)} style={styles.card} activeOpacity={1}>
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
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0,
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
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 36,
  },
  cardsWrap: {
    height: width * 0.63 * 1.48 + 70, 
    justifyContent: 'center',
  },
  carousel: {
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: width * 0.65,
    height: width * 0.63 * 1.48,
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
    height: width * 0.65 * 0.8,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
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
    marginBottom: 24,
    marginHorizontal: 20,
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