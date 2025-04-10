
import * as React from "react"
import Svg, { Path } from 'react-native-svg';

function XIcon(props) {
    const {
        width = 50,
        height = 50,
        color = "#102C4E",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M6 6L18 18M18 6L6 18L18 6Z"  stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </Svg>
    )
}

export default XIcon