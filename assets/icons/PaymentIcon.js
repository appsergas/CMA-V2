import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';


function PaymentIcon(props) {
  const {
    width = 22,
    height = 22,
    color = "#000",
    opacity = 1,     
    fill = "none", 
    strokeWidth = 1.5
  } = props;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      opacity={opacity}
    >
      <Path
        d="M1 7.87451V20.9995H19.75V7.87451H1ZM1 7.87451V4.74951L11.625 0.999512H14.125V7.87451M4.75 12.2495H12.25M16 12.8745V16.6245H21V12.8745H16Z"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    </Svg>
  );
}


export default PaymentIcon