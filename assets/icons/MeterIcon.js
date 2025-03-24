import * as React from "react";
import Svg, { Path, Ellipse } from "react-native-svg";

function MeterIcon(props) {
  const {
    width = 50,
    height = 50,
    color = "#000",
    opacity = 1,     
    fill = "none", 
    strokeWidth = 1.5 
  } = props;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 54 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      opacity={opacity}
    >
      <Path d="M50.6946 35.5679V47.4748C50.6946 51.2358 47.6524 54.278 43.8914 54.278H9.87566C6.11466 54.278 3.07251 51.2358 3.07251 47.4748V35.5679H50.6946Z" stroke={color} fill={fill} />
      <Path d="M43.8914 8.72754H9.87566C6.11466 8.72754 3.07251 11.7697 3.07251 15.5307V34.2379H50.6946V15.5307C50.6946 11.7697 47.6524 8.72754 43.8914 8.72754ZM40.4898 27.4376H13.2772V17.2329H40.4898V27.4376Z" stroke={color} fill={fill} />
      <Path d="M18.3782 2.28312V7.58244H9.87573V2.28312C9.87573 1.45213 10.5486 0.779297 11.3796 0.779297H16.8773C17.7083 0.779297 18.3811 1.45213 18.3811 2.28312H18.3782Z" stroke={color} fill={fill} />
      <Path d="M43.8914 2.28312V7.58244H35.386V2.28312C35.386 1.45213 36.0589 0.779297 36.8899 0.779297H42.3905C43.2215 0.779297 43.8943 1.45213 43.8943 2.28312H43.8914Z" stroke={color} fill={fill} />
      <Path d="M52 33.1074H50.3007" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.69935 33.0884H2" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Ellipse cx="18.0791" cy="22.3342" rx="1.43769" ry="1.43769" stroke={color} fill={fill} />
      <Ellipse cx="29.4138" cy="22.3342" rx="1.43769" ry="1.43769" stroke={color} fill={fill} />
      <Ellipse cx="35.386" cy="22.3342" rx="1.43769" ry="1.43769" stroke={color} fill={fill} />
      <Ellipse cx="23.8011" cy="22.3342" rx="1.43769" ry="1.43769" stroke={color} fill={fill} />
    </Svg>
  );
}

export default MeterIcon;
