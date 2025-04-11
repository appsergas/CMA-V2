import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  Animated,
  Platform,
} from 'react-native';
import PickerControl from '../../controls/Picker';
import { LogooIcon, ArrowIcon } from '../../../assets/icons';

const { width, height } = Dimensions.get('window');

const walkthroughData = [
  {
    title: '',
    subtitle: 'Manage \nyour account \neasily with SERGAS!',
    background: require('../../../assets/images/wt1.png'),
    showLogo: true,
  },
  {
    title: 'Pay Your \nGas Bills',
    subtitle: 'Effortlessly manage\nand pay your gas bills\nanytime, anywhere.',
    background: require('../../../assets/images/wt2.png'),
  },
  {
    title: 'Monitor Your\nGas Usage',
    subtitle: 'Stay in control with\nreal-time tracking \nof your gas consumption.',
    background: require('../../../assets/images/wt3.png'),
  },
  {
    title: 'Manage Your Gas Service',
    subtitle: 'Easily request connection \nor disconnection.',
    background: require('../../../assets/images/wt4.png'),
  },
  {
    title: 'Select Your\nCountry',
    subtitle: '',
    showCountrySelector: true,
    background: require('../../../assets/images/wt5.png'),
  },
];

export default class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollX: new Animated.Value(0),
      currentIndex: 0,
      selectedCountry: '',
    };

    this.flatListRef = React.createRef();
    this.viewConfig = { viewAreaCoveragePercentThreshold: 50 };
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      this.setState({ currentIndex: viewableItems[0].index });
    }
  };

  goToNext = () => {
    const { currentIndex } = this.state;
    if (currentIndex < walkthroughData.length - 1) {
      this.flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  skipToEnd = () => {
    this.flatListRef.current.scrollToIndex({
      index: walkthroughData.length - 1,
    });
  };

  renderItem = ({ item, index }) => {
    const { selectedCountry } = this.state;

    const countryItems = [
      { id: 1, label: '🇦🇪 UAE', value: 'UAE' },
      { id: 2, label: '🇸🇦 Saudi Arabia', value: 'Saudi Arabia' },
      { id: 3, label: '🇴🇲 Oman', value: 'Oman' },
    ];

    return (
      <ImageBackground source={item.background} resizeMode="cover" style={styles.background}>
        <View style={styles.overlay}>
          {item.showLogo && (
            <View style={styles.logo}>
              <LogooIcon />
            </View>
          )}

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {/* {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null} */}
            {item.subtitle ? (
              <Text style={[styles.subtitle, index === 0 && styles.boldSubtitle]}>
                {item.subtitle}
              </Text>
            ) : null}

            {item.title.includes('Manage Your Gas Service') && (
              <View style={{ height: 100 }} />
            )}

            {item.showCountrySelector && (
              <View style={styles.pickerWrapper}>
                <PickerControl
                  placeholder="Select Country"
                  selectedValue={selectedCountry}
                  onValueChange={(value) => {
                    this.setState({ selectedCountry: value });
                  }}
                  items={countryItems}
                  mode="dropdown"
                />

                {!!selectedCountry && (
                  <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={() => this.props.navigation.navigate('Login')}
                  >
                    <Text style={styles.getStartedText}>Continue</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

          </View>
        </View>
      </ImageBackground>
    );
  };

  render() {
    const { currentIndex } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          ref={this.flatListRef}
          data={walkthroughData}
          keyExtractor={(_, index) => index.toString()}
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
        <View style={styles.paginationWrapper}>
          <View style={styles.pagination}>
            {walkthroughData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  this.state.currentIndex === i && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Bottom Controls (hidden on last slide) */}
        {currentIndex !== 4 && (
          <View style={styles.bottomRow}>
            {currentIndex === 3 ? (
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => {
                  this.flatListRef.current.scrollToIndex({ index: 4 });
                }}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.skipButton} onPress={this.skipToEnd}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={this.goToNext}>
                  <ArrowIcon direction="right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1a35',
  },
  background: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  logo: {
    // width: 100,
    // height: 100,
    alignSelf: 'center',
    marginTop: 80,
  },
  textContainer: {
    marginTop: 80,
  },
  title: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    lineHeight: 60,
  },
  subtitle: {
    color: '#fff',
    fontSize: 30,
    marginTop: 30,
    lineHeight: 40,
    fontWeight: '300',
    marginRight: 20,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 238 : 210,
    left: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 4,
    width: 10,
    borderRadius: 2,
    backgroundColor: 'gray',
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 30,
  },

  skipButton: {
    backgroundColor: '#062244',
    paddingVertical: 12,
    paddingHorizontal: 45,
    alignSelf: 'center',
    borderRadius: 14,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#f7931e',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  getStartedButton: {
    backgroundColor: '#f7931e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // Remove flex: 1
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomRow: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 140 : 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width - 48,
    alignSelf: 'center',
    // gap: 12,
  },

  pickerWrapper: {
    marginTop: 30,
  },
  boldSubtitle: {
    fontWeight: 'bold',
  },
  boldSubtitle: {
    fontWeight: 'bold',
  },

});
