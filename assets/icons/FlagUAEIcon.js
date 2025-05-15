import * as React from "react"
import Svg, { Circle, Path, Rect, G,  ClipPath, Defs } from 'react-native-svg';


function FlagUAEIcon(props) {
  const {
    width = 22,
    height = 22,
    color = "#000",
    opacity = 1,     
    fill = "none", 
    strokeWidth = 1.5
  } = props;

  return (
    <Svg width="46" height="34" viewBox="0 0 46 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <G clip-path="url(#clip0_2624_5989)">
    <Path d="M41.619 0H4.38095C1.96142 0 0 2.02964 0 4.53333V29.4667C0 31.9704 1.96142 34 4.38095 34H41.619C44.0386 34 46 31.9704 46 29.4667V4.53333C46 2.02964 44.0386 0 41.619 0Z" fill="white"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 22.6667H46V34.0001H0V22.6667Z" fill="#151515"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H46V11.3333H0V0Z" fill="#249F58"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V34H13.1429V0H0Z" fill="#F93939"/>
    </G>
    <Defs>
    <ClipPath id="clip0_2624_5989">
    <Rect width="46" height="34" rx="6" fill="white"/>
    </ClipPath>
    </Defs>
    </Svg>
    
  );
}


export default FlagUAEIcon