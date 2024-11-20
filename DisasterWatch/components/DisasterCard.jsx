import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const DisasterCard = ({ disaster, distance, timeAgo, icon, onArrowPress }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.arrowButton} onPress={onArrowPress}>
        <Text style={styles.arrow}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.disasterType}>{disaster}</Text>
        <Text style={styles.distance}>{distance}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      <Image source={icon} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#A9A9A9',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    paddingRight: 10,
  },
  arrow: {
    fontSize: 30,
    color: 'black',
  },
  infoContainer: {
    flex: 1,
  },
  disasterType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  distance: {
    fontSize: 14,
    color: 'white',
  },
  time: {
    fontSize: 12,
    color: 'white',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default DisasterCard;
