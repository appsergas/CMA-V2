import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { XIcon } from '../../../assets/icons'; // adjust path if needed

const NotificationDetail = ({ route, navigation }) => {
  const { title, description } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backIcon}
      >
        <XIcon color="#000000" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});
