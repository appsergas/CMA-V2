import * as React from "react"
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';


function RegInfoIcon(props) {
  const {
    width = 22,
    height = 22,
    color = "#000",
    opacity = 1,     
    fill = "none", 
    strokeWidth = 1.5
  } = props;

  return (
    // <Svg
    //   width={width}
    //   height={height}
    //   viewBox="0 0 22 22"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   opacity={opacity}
    // >
    //   <Path
    //     d="M1 7.87451V20.9995H19.75V7.87451H1ZM1 7.87451V4.74951L11.625 0.999512H14.125V7.87451M4.75 12.2495H12.25M16 12.8745V16.6245H21V12.8745H16Z"
    //     stroke={color}
    //     strokeWidth={strokeWidth}
    //     fill={fill}
    //   />
    // </Svg>
    <Svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M13.1706 19.8905C17.3536 19.6125 20.6856 16.2332 20.9598 11.9909C21.0134 11.1607 21.0134 10.3009 20.9598 9.47072C20.6856 5.22838 17.3536 1.84913 13.1706 1.57107C11.7435 1.47621 10.2536 1.47641 8.8294 1.57107C4.64639 1.84913 1.31441 5.22838 1.04024 9.47072C0.986587 10.3009 0.986587 11.1607 1.04024 11.9909C1.1401 13.536 1.82343 14.9666 2.62791 16.1746C3.09501 17.0203 2.78674 18.0758 2.30021 18.9978C1.94941 19.6626 1.77401 19.995 1.91484 20.2351C2.05568 20.4752 2.37026 20.4829 2.99943 20.4982C4.24367 20.5285 5.08268 20.1757 5.74868 19.6846C6.1264 19.4061 6.31527 19.2668 6.44544 19.2508C6.5756 19.2348 6.83177 19.3403 7.34401 19.5513C7.8044 19.7409 8.33896 19.8579 8.8294 19.8905C10.2536 19.9852 11.7435 19.9854 13.1706 19.8905Z" stroke={color} stroke-opacity="0.6" stroke-width="1.5" stroke-linejoin="round"/>
<Path d="M9.5 8.53846C9.5 7.68879 10.1716 7 11 7C11.8284 7 12.5 7.68879 12.5 8.53846C12.5 8.84473 12.4127 9.1301 12.2623 9.36984C11.8141 10.0844 11 10.7657 11 11.6154V12" stroke={color} stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round"/>
<Path d="M11 14H11.009" stroke={color} stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>

  );
}


export default RegInfoIcon