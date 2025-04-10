import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const LogoIcon = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current; // Start from scale 0
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start from opacity 0

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale to normal size
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, // Fade in
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
          <Svg width="92" height="78" viewBox="0 0 92 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path
              d="M90.3439 55.3997C83.2605 78.645 32.7421 92.932 0 52.404C20.0233 73.2657 59.9059 66.4966 66.1119 46.1102C68.6799 37.6777 64.8992 29.5476 55.0766 24.6653C82.7112 26.4296 94.8807 40.515 90.3439 55.3997Z"
              fill="#FF8D00"
            />
            <Path
              d="M0.927153 22.6048C8.01057 -0.64044 58.529 -14.9347 91.2711 25.5933C71.2549 4.7388 31.3723 11.5007 25.1592 31.8871C22.5911 40.3196 26.3718 48.4497 36.1945 53.332C8.55984 51.575 -3.60966 37.4895 0.927153 22.6048Z"
              fill="#0057A2"
            />
          </Svg>
      </Animated.View>
    </View>
  );
};

export default LogoIcon;
