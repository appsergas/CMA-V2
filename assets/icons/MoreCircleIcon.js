import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function MoreCircleIcon(props) {
    const {
        width = 50,
        height = 50,
        color = "#000",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
        <Svg width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M24.7915 13.9987C24.7915 5.90553 22.093 3.20703 13.9998 3.20703C5.90667 3.20703 3.20817 5.90553 3.20817 13.9987C3.20817 22.0919 5.90667 24.7904 13.9998 24.7904C22.093 24.7904 24.7915 22.0919 24.7915 13.9987Z" stroke="#102D4F" strokeWidth={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M10.2615 16.2161H10.251" stroke="#102D4F"  strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
        <Path d="M13.7613 11.5482H13.7508" stroke="#102D4F"  strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
        <Path d="M17.272 16.2161H17.2615" stroke="#102D4F"  strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
        </Svg>
    )
}
export default MoreCircleIcon