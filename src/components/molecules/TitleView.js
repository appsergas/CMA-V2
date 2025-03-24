import React, { useState } from 'react';

import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Fonts } from '../../assets/Fonts';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { fontScaleNormalize } from '../../utils/Functions';
import BoldText from '../atoms/BoldText';


const TitleView = (props) => {

    const {
        title1 = '',
        title2 = '',
        style
    } = props

    return (
        <View style={[{ justifyContent: "center", paddingStart: Dimensions.WP_10, height: Dimensions.HP_30 }, style]}>
            <BoldText style={styles.textStyle}>{title1}</BoldText>
            <BoldText style={styles.textStyle}>{title2}</BoldText>
        </View>
    )
}

export default TitleView

const styles = StyleSheet.create({
    textStyle: {
        color: Colors.DarkBlue,
        fontSize: fontScaleNormalize(34),
        letterSpacing: 0.5,
        // backgroundColor: 'red',
        lineHeight: 44.5,
        fontFamily: Fonts.ExtraBold
    }
})