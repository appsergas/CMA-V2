import React from "react";
import Svg, { Path } from "react-native-svg";

function CameraIcon(props) {
    const {
        width = 22,
        height = 22,
        color = "#102C4E",
        opacity = 1,
        fill = "none",
        strokeWidth = 1.5
    } = props;

    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path d="M13.733 5C15.6278 5 16.1713 5 16.824 5.51662C16.992 5.64962 17.1424 5.80477 17.2713 5.9781C17.7721 6.65136 17.7721 7.62869 17.7721 9.58333V13.3333C17.7721 15.6904 17.7721 16.8689 17.0623 17.6011C16.3525 18.3333 15.21 18.3333 12.9252 18.3333H6.46258C4.17772 18.3333 3.03528 18.3333 2.32546 17.6011C1.61565 16.8689 1.61565 15.6904 1.61565 13.3333V9.58333C1.61565 7.62869 1.61565 6.65136 2.11645 5.9781C2.24538 5.80477 2.39578 5.64962 2.5638 5.51662C3.21646 5 3.75995 5 5.65476 5" stroke={color} fill={fill} stroke-linecap="round" />
            <Path d="M13.733 5.83366L13.0174 3.98818C12.7087 3.19196 12.44 2.28874 11.6461 1.88328C11.2226 1.66699 10.713 1.66699 9.69388 1.66699C8.67473 1.66699 8.16515 1.66699 7.74166 1.88328C6.94777 2.28874 6.67909 3.19196 6.37035 3.98818L5.65476 5.83366" stroke={color} fill={fill} stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M12.5213 11.6667C12.5213 13.2775 11.2554 14.5833 9.69388 14.5833C8.13236 14.5833 6.8665 13.2775 6.8665 11.6667C6.8665 10.0558 8.13236 8.75 9.69388 8.75C11.2554 8.75 12.5213 10.0558 12.5213 11.6667Z" stroke={color} fill={fill} />
            <Path d="M9.69372 5H9.7012" stroke={color} fill={fill} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

        </Svg>
    );
}

export default CameraIcon;
