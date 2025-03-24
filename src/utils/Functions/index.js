import {
    Dimensions
} from 'react-native';
import _ from 'lodash';
import * as ImagePicker from "react-native-image-picker"


const { width, fontScale, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const defaultScaleFactor = width < guidelineBaseWidth ? 0.5 : 1;
const scale = (size) => (width / guidelineBaseWidth) * size;


export const fontScaleNormalize = _.memoize(
    (size: number, factor: number = defaultScaleFactor) =>
        fontScale > 1.4
            ? ((size + (scale(size) - size) * factor) / fontScale) * 1.353
            : size + (scale(size) - size) * factor,
);

export function selectImageFromCamera(fromEdit = false) {
    return new Promise((resolve, reject) => {
        // var result = await checkCameraPermission()
        // if (result) {
        var options = {
            title: 'Select Photo',
            mediaType: 'photo',
            quality: 0.5,
            selectionLimit: 1,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            }
        }
        ImagePicker.launchCamera(options, (response) => {
            resolve(response)

        }).catch((error) => {
            // setLoading(false)
            reject(error)
            // if (error == 'Error: User did not grant camera permission.') {
            //     Alert.alert("Permission!", "Captured Image will be used for Vehicle Information. Do you want to allow?", [
            //         {
            //             text: "Yes",
            //             onPress: () => {
            //                 if (Platform.OS === 'ios') {
            //                     Linking.openURL('app-settings:');
            //                 } else {
            //                     Linking.openSettings()
            //                 }
            //             }
            //         },
            //         {
            //             text: "No"

            //         }
            //     ])
            // }
        })
        // }
    })
}


export function selectImageFromGallery() {
    return new Promise((resolve, reject) => {
        // var result = await checkCameraPermission()
        // if (result) {
        var options = {
            title: 'Select Photo',
            mediaType: 'photo',
            quality: 0.5,
            selectionLimit: 1,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            }
        }
        ImagePicker.launchImageLibrary(options, (response) => {
            resolve(response)

        }).catch((error) => {
            // setLoading(false)
            reject(error)
            console.warn("error", error);
            // if (error == 'Error: User did not grant camera permission.') {
            //     Alert.alert("Permission!", "Captured Image will be used for Vehicle Information. Do you want to allow?", [
            //         {
            //             text: "Yes",
            //             onPress: () => {
            //                 if (Platform.OS === 'ios') {
            //                     Linking.openURL('app-settings:');
            //                 } else {
            //                     Linking.openSettings()
            //                 }
            //             }
            //         },
            //         {
            //             text: "No"

            //         }
            //     ])
            // }
        })
        // }
    })
}