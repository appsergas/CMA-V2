import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import { Fonts } from '../../assets/Fonts';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { fontScaleNormalize } from '../../utils/Functions';
import CustomText from './CustomText';
// import Cross from '../res/Svgs/Cross.svg'



const CustomTextInput = (props) => {

    const {
        isNumber = false,
        dialCode = 61,
        mainStyle,
        textInputStyle,
        isIcon = false,
        placeHolder,
        onPress,
        keyboardType = 'default',
        value,
        isPress = false,
        hasError = false,
        errorMessage = 'This field can not be empty',
        returnKeyType = 'default',
        maxLength = null,
        focusNeeded = false,
        editable = true,
        titleStyle,
        Label = '',
        mainContainer,
        secureTextEntry = false,
        imageSource,
        placeHolderTextColor,
        onButtonPress,
        multiline = false
    } = props
    return (
        <View style={[mainContainer]}>
            <CustomText style={[titleStyle]}>{Label}</CustomText>
            <TouchableOpacity style={[styles.MainContainer, { borderColor: hasError ? Colors.Red : 'rgb(237,237,243)' }, mainStyle,]}
                activeOpacity={1} onPress={onButtonPress ? onButtonPress : null}>
                {isNumber && <View style={styles.DialCodeContainer}>
                    <CustomText style={{ color: Colors.Black }}>{"+" + dialCode}</CustomText>
                </View>}
                <TextInput
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    multiline={multiline}
                    // textAlignVertical={'center'}
                    value={value}
                    onPressIn={() => {

                        if (isPress) {
                            onPress()
                        }
                    }}
                    onFocus={() => {
                        if (focusNeeded) {
                            props.onFocus()
                        }
                    }}
                    onBlur={() => {
                        if (focusNeeded) {
                            props.onBlur()
                        }
                    }}
                    style={[styles.textInputStyle, textInputStyle]}
                    placeholder={placeHolder}
                    placeholderTextColor={placeHolderTextColor ? placeHolderTextColor : Colors.PlaceHolderColor}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    onChangeText={(text) => {
                        props.onChangeText(text)
                    }}
                ></TextInput>
                {isIcon && <TouchableOpacity style={styles.IconButtonStyle}
                    onPress={() => {
                        props.onIconPress()
                    }}
                >
                    <Image
                        source={imageSource}
                        style={{ height: 23, width: 23, tintColor: placeHolderTextColor }}
                    >

                    </Image>
                </TouchableOpacity>}
            </TouchableOpacity>
            {hasError && <Text style={{ color: 'red', marginTop: 2 }}>*{errorMessage}</Text>}
        </View>
    )

}


export default CustomTextInput

const styles = StyleSheet.create({
    MainContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        paddingHorizontal: 5,
        borderRadius: 10,
        height: Dimensions.HP_6,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'red',
        marginTop: 10,


    },
    DialCodeContainer: {
        marginStart: 10,
        marginRight: 5,
        flexDirection: 'row',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInputStyle: {
        flex: 1,
        color: Colors.Black,
        paddingLeft: 10,
        // height: Dimensions.HP_5,

        fontFamily: Fonts.Medium,
        letterSpacing: 0.5,
        fontSize: fontScaleNormalize(14),
        // backgroundColor: 'red'
        // paddingVertical: 12,
        // paddingHorizontal: 7,
        // width: '100%',

        // backgroundColor: 'red'

    },
    IconButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        // height: 17,
        // width: 17,
        // borderRadius: 17,
        alignSelf: 'center',
        // backgroundColor: Colors.Black

    },
    IconStyle: {


    }
})