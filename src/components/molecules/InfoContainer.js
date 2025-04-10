import React from 'react';
import { Platform, Dimensions } from 'react-native';

import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors/Colors';
// import Dimensions from '../../utils/Dimensions';


const InfoContainer = (props) => {

    const {
        style,
        colors = ['rgba(51, 93, 147, 1)', 'rgba(95, 138, 199, 1)'],
        // colors = ['rgba(234, 234, 235, 1)', 'rgba(234, 234, 235, 1)']
    } = props

    return (

        <View style={{ justifyContent: "flex-end", flex: 1, }}>

            <LinearGradient colors={colors} style={[styles.modalView, style]}>
                {
                    props.children
                }
            </LinearGradient>
        </View>
    )
}

const { height } = Dimensions.get('window');
const modalMinHeight = Platform.isPad ? Dimensions.get('screen').height * 0.74 : height * 0.84;

const styles = StyleSheet.create({
    modalView: {
        // backgroundColor: Colors.Blue1,
        // minHeight: modalMinHeight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: '100%',
    }
})

export default InfoContainer