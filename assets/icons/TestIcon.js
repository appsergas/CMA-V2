import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

function TestIcon(props) {
    return (
        <Svg width="38" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M1 6.86V29h36V6.86m-36 0V1h36v5.86m-36 0h36M7 13.5h12M7 17.256h24" stroke={props.color} />
        </Svg>
    )
}

export default TestIcon