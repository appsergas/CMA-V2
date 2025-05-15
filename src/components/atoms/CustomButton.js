import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { Fonts } from '../../assets/Fonts';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { fontScaleNormalize } from '../../utils/Functions';
import { Images } from '../../utils/ImageSource/imageSource';
import CustomText from './CustomText';

const CustomButton = (props) => {

    const {
        title = '',
        style,
        textStyle,
        disabled = false,
        isIcon = false,
        imageSource = '',
        mainStyle,
        label = '',
        loading = false
    } = props

    return (
        <View style={[mainStyle]}>
            {label.length > 0 && <Text style={{ color: Colors.Grey, fontFamily: Fonts.Medium, }}>{label}</Text>}
            <TouchableOpacity style={[styles.defaultStyle, { backgroundColor: disabled ? Colors.Grey : Colors.Red, paddingHorizontal: isIcon ? 20 : 0 }, style]}
                disabled={disabled}
                onPress={() => props.onPress()}
            >
                {
                    (loading) ?
                    <ActivityIndicator size='small' color='white' /> :
                    <CustomText 
                    onPress={() => props.onPress ? props.onPress() : {}}
                    style={[{
                        color: Colors.White, fontSize: fontScaleNormalize(14), fontFamily: Fonts.Bold, flex: isIcon ? 1 : null
                    }, textStyle]}>{title}</CustomText>
                  }
                
                {isIcon && <Image source={imageSource} style={{ height: 25, width: 25, tintColor: Colors.Grey }}></Image>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    defaultStyle: {
        height: Dimensions.HP_7,
        width: Dimensions.WP_83,
        borderRadius: 10,
        backgroundColor: Colors.DarkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

    }
})

export default CustomButton