import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function CircleRadioIcon(props) {
  const {
    width = 22,
    height = 22,
    color = "#000",
    opacity = 1,
    fill = "none",
    strokeWidth = 1.5
  } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="12" fill={fill} />
      <Circle cx="12" cy="12" r="6" fill="#F7FAFC" />
    </Svg>
  );
}

export default CircleRadioIcon