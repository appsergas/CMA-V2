
import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function SupportIcon(props) {
    const {
        width = 50,
        height = 50,
        color = "#000",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" stroke={color} fill={fill} xmlns="http://www.w3.org/2000/svg">
            <Rect x="0.75" y="0.749512" width="7.32142" height="7.32142" sstroke={color} fill={fill} stroke-width="1.5" />
            <Rect x="11.9286" y="0.749512" width="7.32142" height="7.32142" stroke={color} fill={fill} stroke-width="1.5" />
            <Rect x="0.75" y="11.9277" width="7.32142" height="7.32142" stroke={color} fill={fill} stroke-width="1.5" />
            <Rect x="11.9286" y="11.9277" width="7.32142" height="7.32142" sstroke={color} fill={fill} stroke-width="1.5" />
        </Svg>
    )
}

export default SupportIcon