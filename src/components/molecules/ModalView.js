import React, { createRef, useEffect, useRef, useState } from 'react';

import {
    FlatList,
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';




const ModalView = (props) => {

    const {
        mainStyle,
        style,
        isVisible = false,
        onModalClose
    } = props

    return (
        <ReactNativeModal
            isVisible={isVisible}
            swipeDirection={'down'}
            onSwipeComplete={onModalClose}
            onBackdropPress={onModalClose}
            style={{ margin: 0 }}
            backdropColor={Colors.modalBackDropColor}

        >
            <View style={[{ flex: 1, justifyContent: 'center' }, mainStyle]}>
                <View style={[{ height: Dimensions.HP_50, width: "100%" }, style]}>
                    {
                        props.children
                    }
                </View>
            </View>
        </ReactNativeModal>
    )
}

export default ModalView