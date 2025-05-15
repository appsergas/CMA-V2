import React, { useState } from 'react';

import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Fonts } from '../../assets/Fonts';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import CustomText from '../atoms/CustomText';





const ButtonLogoView = (props) => {

    const {
        style,
        onPress,
        hideBackButton = false,
        logout,
        yourRequests = false
    } = props

    return (
        <View style={[{ width: '100%', flexDirection: 'row', paddingHorizontal: 25, height: Dimensions.HP_10, paddingTop: Dimensions.HP_3, }, style]}>
            
            {yourRequests ? <TouchableOpacity style={{ flex: 1 }} 
                            // onPress={() => {
                            //     props.navigation.navigate("SpotlightList")
                            // }}
                            onPress={onPress}
                            >
            <CustomText style={{ color: Colors.DarkBlue, fontFamily: Fonts.Medium, marginTop: 20,marginRight: 30, alignSelf: 'flex-start' }} onPress={() => {
                                props.navigation.navigate("SpotlightList")
                            }}>Go to your requests</CustomText>
            </TouchableOpacity> : !hideBackButton ? <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
                <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
            </TouchableOpacity> : <View style={{ flex: 1 }}></View>}
            {/* <Image source={Images.BackButton} style={{ height: 48, width: 46 }}></Image> */}
        </View>
    )
}

export default ButtonLogoView