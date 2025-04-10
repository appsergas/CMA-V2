import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, G, Mask } from 'react-native-svg';

const OTPIcon = () => (
    <View>
        <Svg width="130" height="109" viewBox="0 0 130 109" fill="none">
            {/* Circular Mask */}
            <Mask id="mask0" x="0" y="0" width="96" height="96">
                <Circle cx="48" cy="48" r="48" fill="#D9D9D9" />
            </Mask>

            <G mask="url(#mask0)">
                {/* Background Circle */}
                <Circle cx="48" cy="48" r="48" fill="white" />

                {/* Phone Icon */}
                <G>
                    <Rect x="-2" y="19" width="65.6" height="110.05" rx="8" fill="#0057A2" />
                </G>
                <Rect x="2.1" y="30" width="57.4" height="89.42" rx="4" fill="#006CCA" />
                <Rect x="2.1" y="24.5" width="16.4" height="2.75" rx="1" fill="#0089FF" />
                <Rect x="6" y="35" width="50" height="26" rx="2" fill="#0089FF" />
                <Rect x="6" y="64" width="39" height="4" rx="1" fill="#0089FF" />
                <Rect x="6" y="70" width="30" height="4" rx="1" fill="#0089FF" />
                <Rect x="6" y="76" width="47" height="4" rx="1" fill="#0089FF" />
                <Rect x="45.8" y="24.5" width="13.6" height="2.75" rx="1" fill="#0089FF" />
                <Rect x="37.6" y="24.5" width="6.83" height="2.75" rx="1" fill="#0089FF" />
            </G>

            {/* OTP Box */}
            <G>
                <Rect x="31" y="45" width="79" height="40" rx="8" fill="white" />
            </G>

            {/* Green Checkmark */}
            <Circle cx="48" cy="65" r="10" fill="#22C55E" />
            <Path 
                d="M43.9166 65.0002L46.8333 67.9168L52.6666 62.0835" 
                stroke="white" 
                strokeWidth="1.52" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />

            {/* OTP Input Fields */}
            <Rect x="64" y="53" width="20.5" height="2.08" rx="0.76" fill="#EEF2F6" />
            <Rect x="64" y="57.17" width="38" height="2.08" rx="0.76" fill="#EEF2F6" />
            <Rect x="64" y="62.39" width="38" height="14.6" rx="1.52" fill="#EEF2F6" />

            {/* OTP Digits */}
            {["70.64", "78.86", "87.08", "95.29"].map((x, index) => (
                <Path
                    key={index}
                    d={`
                        M${x} 72.82L${parseFloat(x) + 0.09} 70.43L${parseFloat(x) - 2} 71.71L${parseFloat(x) - 2.5} 70.8
                        L${parseFloat(x)} 69.69L${parseFloat(x) - 2} 68.58L${parseFloat(x) - 1.5} 67.67L${parseFloat(x) + 0.4} 68.95
                        L${parseFloat(x) + 0.3} 66.56H${parseFloat(x) + 1.4}L${parseFloat(x) + 1.3} 68.95L${parseFloat(x) + 3.4} 67.67
                        L${parseFloat(x) + 4} 68.58L${parseFloat(x) + 1.7} 69.69L${parseFloat(x) + 4} 70.8L${parseFloat(x) + 3.4} 71.71
                        L${parseFloat(x) + 1.3} 70.43L${parseFloat(x) + 1.4} 72.82H${x}
                    `}
                    fill="#0F172A"
                />
            ))}
        </Svg>
    </View>
);


export default OTPIcon;
