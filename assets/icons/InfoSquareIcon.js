import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function InfoSquareIcon(props) {
    const {
        width = 50,
        height = 50,
        color = "#000",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
        <Svg width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" opacity={opacity}>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M3.20801 13.9993C3.20801 22.0925 5.90651 24.791 13.9997 24.791C22.0928 24.791 24.7913 22.0925 24.7913 13.9993C24.7913 5.90618 22.0928 3.20768 13.9997 3.20768C5.90651 3.20768 3.20801 5.90618 3.20801 13.9993Z" strokeWidth={strokeWidth} stroke="#102D4F"  strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M13.9998 18.543V13.9988" stroke="#102D4F"  strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
            <Path d="M13.9946 9.91667H14.0051" stroke="#102D4F"  strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
        </Svg>

    )
}
export default InfoSquareIcon