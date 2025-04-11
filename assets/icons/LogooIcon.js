import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

function LogooIcon(props) {
  const {
    width = 92,
    height = 78,
    color = "#000",
    opacity = 1,
    fill = "none",
    strokeWidth = 1.5
  } = props;
  return (    
      <Svg width={width} height={height} viewBox="0 0 92 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M90.3439 55.3997C83.2605 78.645 32.7421 92.932 0 52.404C20.0233 73.2657 59.9059 66.4966 66.1119 46.1102C68.6799 37.6777 64.8992 29.5476 55.0766 24.6653C82.7112 26.4296 94.8807 40.515 90.3439 55.3997Z"
          fill="#FF8D00"
        />
        <Path
          d="M0.927153 22.6048C8.01057 -0.64044 58.529 -14.9347 91.2711 25.5933C71.2549 4.7388 31.3723 11.5007 25.1592 31.8871C22.5911 40.3196 26.3718 48.4497 36.1945 53.332C8.55984 51.575 -3.60966 37.4895 0.927153 22.6048Z"
          fill="#0057A2"
        />
      </Svg>
  );
};

export default LogooIcon;
