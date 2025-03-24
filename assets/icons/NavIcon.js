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
      <Path d="M24.5 3.5L3.5 9.5L14.0014 14L18.5019 24.5L24.5 3.5Z" stroke="#102D4F" stroke-width="1.5" stroke-linejoin="round"/>
       </Svg>
  );
}

export default MeterIcon;
