import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function LogOutIcon(props) {
    const {
        width = 50,
        height = 50,
        color = "#000",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M25.4228 14.1419H11.375" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke={color} fill={fill} strokeWidth={strokeWidth} />
            <Path d="M22.0083 10.7383L25.4243 14.1403L22.0083 17.5423" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke={color} fill={fill} strokeWidth={strokeWidth} />
            <Path d="M19.0864 8.90232C18.7014 4.72565 17.1381 3.20898 10.9198 3.20898C2.63527 3.20898 2.63527 5.90398 2.63527 14.0007C2.63527 22.0973 2.63527 24.7923 10.9198 24.7923C17.1381 24.7923 18.7014 23.2757 19.0864 19.099" strokeWidth={strokeWidth} stroke-linecap="round" stroke-linejoin="round" stroke={color} fill={fill} />
        </Svg>
    )
}
export default LogOutIcon