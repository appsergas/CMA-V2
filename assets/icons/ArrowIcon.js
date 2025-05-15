import React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowIcon({ direction = "down", color = "#102D4F", size = 20 }) {
    // Map direction to rotation values
    const rotationMap = {
        right: "0",
        down: "90",
        left: "180",
        up: "-90"
    };

    const rotation = rotationMap[direction] || "0"; // Default to right

    return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <Path
                d="M7.08334 4.16732L12.9167 10.0007L7.08334 15.834"
                stroke={color}
                strokeWidth="2.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`rotate(${rotation} 10 10)`}
            />
        </Svg>
    );
}

export default ArrowIcon;
