import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function TypeCursorIcon(props) {
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
            <Path d="M7.00016 18.6663C5.9152 18.6663 5.37271 18.6663 4.92763 18.5471C3.71981 18.2234 2.77639 17.28 2.45276 16.0722C2.3335 15.6271 2.3335 15.0846 2.3335 13.9997C2.3335 12.9147 2.3335 12.3722 2.45276 11.9271C2.77639 10.7193 3.71981 9.7759 4.92763 9.45227C5.37271 9.33301 5.9152 9.33301 7.00016 9.33301M14.0002 18.6663H21.0002C22.0851 18.6663 22.6276 18.6663 23.0727 18.5471C24.2805 18.2234 25.2239 17.28 25.5476 16.0722C25.6668 15.6271 25.6668 15.0846 25.6668 13.9997C25.6668 12.9147 25.6668 12.3722 25.5476 11.9271C25.2239 10.7193 24.2805 9.7759 23.0727 9.45227C22.6276 9.33301 22.0851 9.33301 21.0002 9.33301H14.0002" stroke={color} fill={fill} strokeWidth={strokeWidth} stroke-linecap="round" />
            <Path d="M8.16699 3.5H10.5003M12.8337 3.5H10.5003M10.5003 3.5V24.5M10.5003 24.5H8.16699M10.5003 24.5H12.8337" stroke={color} fill={fill} strokeWidth={strokeWidth} stroke-linecap="round" stroke-linejoin="round" />
        </Svg>

    )
}
export default TypeCursorIcon