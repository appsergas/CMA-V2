import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const walkthroughData = [
  {
    title: 'Manage your account easily with SERGAS!',
  },
  {
    title: 'Pay Your Gas Bills',
    subtitle: 'Effortlessly manage and pay your gas bills anytime, anywhere.',
  },
  {
    title: 'Monitor Your Gas Usage',
    subtitle: 'Stay in control with real-time tracking of your gas consumption.',
  },
  {
    title: 'Manage Your Gas Service',
    subtitle: 'Easily request connection or disconnection.',
    showGetStarted: true,
  },
  {
    title: 'Select Your Country',
    showCountrySelector: true,
  },
];

export default class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollX: new Animated.Value(0),
      selectedCountry: 'UAE',
      currentIndex: 0,
    };

    this.flatListRef = React.createRef();
    this.viewConfig = { viewAreaCoveragePercentThreshold: 50 };
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      this.setState({ currentIndex: viewableItems[0].index });
    }
  };

  renderItem = ({ item, index }) => {
    const { selectedCountry } = this.state;

    if (item.showCountrySelector) {
      return (
        <View style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(value) => {
                this.setState({ selectedCountry: value });
                this.props.navigation.navigate('Login'); // ✅ Your requested style
              }}
              style={styles.picker}
            >
              <Picker.Item label="🇦🇪 UAE" value="UAE" />
              <Picker.Item label="🇸🇦 Saudi Arabia" value="Saudi Arabia" />
              <Picker.Item label="🇴🇲 Oman" value="Oman" />
            </Picker>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        <Image
          source={require('../../../assets/images/sergas_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}

        {item.showGetStarted ? (
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={() =>
              this.flatListRef.current.scrollToIndex({
                index: walkthroughData.length - 1,
              })
            }
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={() =>
                this.flatListRef.current.scrollToIndex({
                  index: walkthroughData.length - 1,
                })
              }
            >
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={() =>
                this.flatListRef.current.scrollToIndex({
                  index: this.state.currentIndex + 1,
                })
              }
            >
              <Text style={styles.arrowText}>E</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.FlatList
          ref={this.flatListRef}
          data={walkthroughData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewConfig}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {walkthroughData.map((_, i) => {
            const inputRange = [
              (i - 1) * width,
              i * width,
              (i + 1) * width,
            ];
            const dotWidth = this.state.scrollX.interpolate({
              inputRange,
              outputRange: [10, 30, 10],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    backgroundColor:
                      i === this.state.currentIndex ? '#fff' : 'gray',
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1a35',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  skip: {
    color: '#fff',
    fontSize: 18,
  },
  arrowBtn: {
    backgroundColor: '#f7931e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  arrowText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  getStartedBtn: {
    marginTop: 40,
    backgroundColor: '#f7931e',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 80,
  },
  getStartedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pagination: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 70,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  pickerWrapper: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
