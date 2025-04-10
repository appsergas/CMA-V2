
import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function 
IdentificationIcon(props) {
    const {
        width = 50,
        height = 50,
        color = "#000",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
<Svg width={width} height={height}  fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M10.6577 2.91602C7.54706 2.98689 5.73016 3.283 4.48876 4.5201C3.40227 5.60281 3.03908 7.12484 2.91768 9.56602M17.3443 2.91602C20.455 2.98689 22.2719 3.283 23.5133 4.5201C24.5997 5.60281 24.9629 7.12484 25.0843 9.56602M17.3443 25.0827C20.455 25.0118 22.2719 24.7157 23.5133 23.4786C24.5997 22.3959 24.9629 20.8739 25.0843 18.4327M10.6577 25.0827C7.54706 25.0118 5.73016 24.7157 4.48876 23.4786C3.40227 22.3959 3.03908 20.8739 2.91768 18.4327" stroke="#102D4F" strokeWidth={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
<Path d="M9.33333 19.8327C11.4782 16.8048 16.4719 16.6395 18.6667 19.8327M16.9167 11.0827C16.9167 12.6935 15.6108 13.9993 14 13.9993C12.3892 13.9993 11.0833 12.6935 11.0833 11.0827C11.0833 9.47185 12.3892 8.16602 14 8.16602C15.6108 8.16602 16.9167 9.47185 16.9167 11.0827Z" stroke="#102D4F" strokeWidth={strokeWidth} stroke-linecap="round"/>
</Svg>

    )
}

export default IdentificationIcon