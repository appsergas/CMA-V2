
import React, { Component } from 'react'
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
import { XIcon, LogooIcon } from '../../../assets/icons'
import LinearGradient from 'react-native-linear-gradient';


export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      notifications: [
        {
          id: '1',
          title: 'Billing Approved',
          description: 'you pay 76 AED, Feb Gas Bill.',
          isNew: true,
        },
        {
          id: '2',
          title: 'Billing Approved',
          description: 'you pay 76 AED.',
          isNew: true,
        },
        {
          id: '3',
          title: 'Billing Approved',
          description: 'you pay 76 AED.',
        },
        {
          id: '4',
          title: 'Billing Approved',
          description: 'you pay 76 AED.',
        },
        {
          id: '5',
          title: 'Billing Approved',
          description: 'you pay 76 AED.',
        },
      ],
    };
  }

  renderItem = ({ item }) => (
    <View
      style={[
        styles.notificationCard,
        item.isNew && styles.notificationCardNew,
      ]}
    >

      <View style={styles.logoWrapper}>
        <LinearGradient
          colors={['#092A59', '#1E477A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoCircle}
        >
          <LogooIcon width={30} height={30} />
        </LinearGradient>
      </View>

      <View style={styles.notificationTextWrapper}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
    </View>
  );

  render() {
    const { notifications, loading } = this.state;

    return (

      <View style={styles.container}>
        {/* Back Button */}
        <View style={styles.topSection}>
          {/* X Icon Row */}
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.backIcon}
          >
            <XIcon color="#000000" />
          </TouchableOpacity>

          {/* Heading Below */}
          <Text style={styles.headerTitle}>Today Notifications</Text>
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={this.renderItem}
          contentContainerStyle={styles.listContent}
        />

        {/* Activity Indicator */}
        {loading && (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
            style={styles.loader}
          />
        )}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 16,
  },
  backIcon: {
    marginRight: 12,
  },

  logoWrapper: {
    marginRight: 12,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topSection: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  
  backIcon: {
    marginBottom: 24,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  notificationCardNew: {
    backgroundColor: '#EDEBFD',
  },
  notificationImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    resizeMode: 'contain',
    marginRight: 12,
  },
  notificationTextWrapper: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  notificationDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B6475',
    marginTop: 4,
  },
  loader: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});
