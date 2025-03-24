
import React, { useEffect, useState } from 'react';

import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';


const ImageAttachmentView = (props) => {

    const {
        onPress,
        uri = '',
        footerView = false
    } = props

    return (
        <View>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    aspectRatio: 1, height: Dimensions.WP_14, borderRadius: 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderStyle: 'dotted', borderWidth: 1, borderColor: Colors.DarkBlue, backgroundColor: Colors.LighterBlue
                }}>
                {uri.length > 0 ?
                    <Image source={{ uri: uri }} style={{ aspectRatio: 1, height: Dimensions.WP_14, borderRadius: 9 }}></Image>

                    : <Image source={!footerView ? Images.Attachment : Images.Plus} style={{ height: 20, width: 20, tintColor: Colors.DarkBlue }}></Image>}

            </TouchableOpacity>

        </View>
    )
}

export default ImageAttachmentView