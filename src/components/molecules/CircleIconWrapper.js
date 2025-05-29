import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

const CircleIconWrapper = ({ size = 44, backgroundColor = "#FFFFFF", children, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CircleIconWrapper;
