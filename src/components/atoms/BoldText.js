import React from 'react';
import {
    StyleSheet,
    Text,
} from 'react-native';
import { Fonts } from '../../assets/Fonts';
import { Colors } from '../../utils/Colors/Colors';

const BoldText = (props) => {

    const {
        style,
        onPress
    } = props

    return (

        <Text
            onPress={onPress}
            style={[styles.defaultStyle, style]}
            allowFontScaling={false}
        >{props.children}</Text>
    )
}

export default BoldText

const styles = StyleSheet.create({
    defaultStyle: {
        color: Colors.Black,
        // fontWeight: '600',
        fontFamily: Fonts.ExtraBold,
        letterSpacing: 0.5
    }
})