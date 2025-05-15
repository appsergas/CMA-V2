import React from 'react';
import {
    StyleSheet,
    Text,
} from 'react-native';
import { Fonts } from '../../assets/Fonts';
import { Colors } from '../../utils/Colors/Colors';

const CustomText = (props) => {

    const {
        style,
        numberOfLines = null
    } = props

    return (

        <Text
            style={[styles.defaultStyle, style]}
            allowFontScaling={false}
            numberOfLines={numberOfLines}
            onPress={() => props.onPress ? props.onPress() : {}}
        >{props.children}</Text>
    )
}

export default CustomText

const styles = StyleSheet.create({
    defaultStyle: {
        color: Colors.Black,
        fontFamily: Fonts.Medium,
        letterSpacing: 0.5
        // fontWeight: '66'


    }
})