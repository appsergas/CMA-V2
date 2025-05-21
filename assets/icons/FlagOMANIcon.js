import * as React from "react"
import Svg, { Circle, Path, Rect, G,  ClipPath, Defs } from 'react-native-svg';


function FlagOMANIcon(props) {
  const {
    width = 22,
    height = 22,
    color = "#000",
    opacity = 1,     
    fill = "none", 
    strokeWidth = 1.5
  } = props;

  return (
    <Svg width="46" height="34" viewBox="0 0 46 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<G clip-path="url(#clip0_2128_4509)">
<Rect width="46" height="34" rx="6" fill="#F93939"/>
<Path d="M41.619 0H4.38095C1.96142 0 0 2.02964 0 4.53333V29.4667C0 31.9704 1.96142 34 4.38095 34H41.619C44.0386 34 46 31.9704 46 29.4667V4.53333C46 2.02964 44.0386 0 41.619 0Z" fill="#F93939"/>
<Path fill-rule="evenodd" clip-rule="evenodd" d="M13.1428 22.6667H46V34.0001H13.1428V22.6667Z" fill="#249F58"/>
<Path fill-rule="evenodd" clip-rule="evenodd" d="M13.1429 0H46.0001V11.3333H13.1429V0ZM10.0237 8.8468C9.9032 9.03493 9.7652 9.20947 9.60749 9.37493C8.32168 10.7032 6.24072 10.7032 4.9593 9.37493C3.67568 8.04893 3.67568 5.8956 4.9593 4.5696C5.11701 4.40187 5.28787 4.25907 5.46968 4.1344C4.97682 5.0864 5.38206 6.6096 6.50796 7.7724C7.63387 8.93293 9.10368 9.35453 10.0259 8.84453L10.0237 8.8468Z" fill="white"/>
<Path fill-rule="evenodd" clip-rule="evenodd" d="M5.30981 8.84692C5.43028 9.03506 5.56828 9.20959 5.726 9.37506C7.01181 10.7033 9.09276 10.7033 10.3742 9.37506C11.6578 8.04906 11.6578 5.89572 10.3742 4.56972C10.2165 4.40199 10.0456 4.25919 9.86381 4.13452C10.3567 5.08652 9.95143 6.60972 8.82552 7.77252C7.69962 8.93305 6.22981 9.35466 5.30762 8.84466L5.30981 8.84692Z" fill="white"/>
</G>
<Defs>
<ClipPath id="clip0_2128_4509">
<Rect width="46" height="34" rx="6" fill="white"/>
</ClipPath>
</Defs>
</Svg>

    
  );
}


export default FlagOMANIcon