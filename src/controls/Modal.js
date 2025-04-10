/**
 * Component for showing popup of the user action.
 * Usage:
 * const modalcontent = { "title": "Delate this contact", "message": "Are you sure? All details about this contact will be removed." }
 * const [modalVisible, setModalVisible] = useState(false);
 * const onPressValue = () => {
 * 	setModalVisible(!modalVisible);
 * }
 * <Modal visible={modalVisible} onPress={onPressValue} data={modalcontent} />
 */

import { Dimensions, Modal, StyleSheet, Text, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

import PropTypes from "prop-types";
import { ScrollView } from 'react-native-gesture-handler';
import { XIcon } from '../../assets/icons'


const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));

    useEffect(() => {
        const onChange = result => {
            setScreenData(result.screen);
        };

        Dimensions.addEventListener('change', onChange);

        return () => Dimensions.removeEventListener('change', onChange);
    });

    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
    };
};

/**
 * @param  {} props
 */
function CustomModal(props) {

    const { visible, onPress, data, button1, button2, onButton1, onButton2, onClose, titleText, logOutWarningMessage, close } = props

    function handleButton1() {
        onButton1();
    }

    function handleButton2() {
        onButton2()
    }
    const screenData = useScreenDimensions();

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                <View style={[styles.modal, screenData.isLandscape && styles.modalLandscape]}>
                    <View style={styles.modalView}>
                        <View
                            style={{ ...styles.modalViewInnerContainer, ...titleText }}
                        >
                            {
                                (close == undefined) || (close == null) || close ? <TouchableOpacity style={{ marginTop: 1, alignSelf: 'flex-end' }}
                                    onPress={() => {
                                        onClose()
                                    }}
                                >
                                    {/* <Image
                                    source={require("../../assets/images/Close_copy.png")}
                                    style={styles.iconIonicIosArrowImage}
                                /> */}
                                    <View style={{ ...styles.iconIonicIosArrowImage }}>
                                        <XIcon />
                                    </View>
                                </TouchableOpacity> : null}

                            {
                                ((data.title != null) && (data.title != "Test"))
                                    ?
                                    <View style={{ marginTop: 17 }}>
                                        <Text
                                            style={styles.deleteThisContactTitle}>{data.title}</Text>
                                    </View>
                                    :
                                    null
                            }

                            {(data.uri != null) ?
                                <View style={{ marginTop: 20 }}>
                                    {/* <Text
                                 style={styles.deleteThisContactText}>
                                 {data.message}
                             </Text> */}
                                    <Image style={data.imageStyle != null ? data.imageStyle : styles.addImage} source={data.uri} />
                                </View> :
                                ((data.message != null) && (data.message != "Test")) ?
                                    <ScrollView style={{ marginTop: 20, maxHeight: 200 }}>
                                        {data.message.split('\\n').map((line, index) => (
                                            <Text style={styles.deleteThisContactText} key={index}>{line}</Text>
                                        ))}
                                        {/* <Image style={styles.addImage} source={{ uri: data.uri }} /> */}
                                    </ScrollView>
                                    : null}
                            {((data.view != null) && (data.view != undefined)) ?
                                <View style={{ marginTop: 20, width: "90%" }}>
                                    {data.view}
                                    {/* <Image style={styles.addImage} source={{ uri: data.uri }} /> */}
                                </View>
                                : null}
                            <View
                                pointerEvents="box-none"
                                style={button1 && button2 ? styles.modalButtonContainer : styles.modalSingleButtonContainer}
                            >
                                {button1 ? <TouchableHighlight underlayColor='none'
                                    onPress={handleButton1}
                                >
                                    <View style={button1 && button2 ? styles.cancelView : styles.cancelView12}>
                                        <Text style={styles.cancelText}>{data.button1Text}</Text>
                                    </View>
                                </TouchableHighlight>
                                    : null}
                                {button2 ? <TouchableHighlight underlayColor='none'
                                    onPress={handleButton2}
                                >
                                    <View
                                        style={button1 && button2 ? styles.deleteView : { ...styles.deleteView }}>
                                        <Text
                                            style={styles.deleteText}>{data.button2Text}</Text>
                                    </View>
                                </TouchableHighlight> : null}
                            </View>
                            {logOutWarningMessage ? <View><Text style={styles.logOutWarningMessage}>If you click on the logout, App will be closed for security reasons.</Text></View> : null}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        backgroundColor: "transparent",
        width: "100%"
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    modalLandscape: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    deleteThisContactTitle: {
        color: "#102D4F",
        fontFamily: "Tajawal-Bold",
        fontSize: 18,
        fontStyle: "normal",
        textAlign: "left",
        backgroundColor: "transparent",
        paddingBottom: 5,
    },
    deleteThisContactText: {
        color: "rgb(128, 140, 144)",
        fontFamily: "Tajawal-Regular",
        fontSize: 14,
        fontStyle: "normal",
        textAlign: 'justify',
        backgroundColor: "transparent",
        marginLeft: 15,
        marginRight: 15,
        flexDirection: "column"
    },
    cancelView: {
        backgroundColor: "#102D4F",
        borderRadius: 4,
        width: 95,
        height: 25,
        justifyContent: "center",
    },
    cancelView12: {
        backgroundColor: "rgb(79, 194, 212)",
        borderRadius: 4,
        width: 95,
        height: 25,
        justifyContent: "center",
        alignItems: 'center',
    },
    cancelText: {
        color: "white",
        fontFamily: "Tajawal-Bold",
        fontSize: 12,
        fontStyle: "normal",
        textAlign: "center",
        letterSpacing: 1,
        backgroundColor: "transparent",
    },
    deleteView: {
        backgroundColor: "transparent",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#102D4F",
        borderStyle: "solid",
        width: 100,
        height: 25,
        justifyContent: "center",
        marginLeft: 20
    },
    deleteText: {
        color: "#102D4F",
        fontFamily: "Tajawal-Bold",
        fontSize: 12,
        fontStyle: "normal",
        textAlign: "center",
        letterSpacing: 1.2,
        backgroundColor: "transparent",
        marginLeft: 18,
        marginRight: 18,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 4,
        justifyContent: 'center',
        alignSelf: "center",
        shadowColor: "rgba(0, 0, 0, 0.16)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 12,
        shadowOpacity: 1,
        elevation: 5,
        width: "100%"
    },
    modalViewInnerContainer: {
        justifyContent: "center",
        alignSelf: "center",
        textAlignVertical: "center",
        width: "100%"
    },
    modalButtonContainer: {
        alignSelf: "center",
        justifyContent: "center",
        width: 300,
        height: 25,
        marginTop: 14,
        marginBottom: 14,
        flexDirection: "row",
    },
    modalSingleButtonContainer: {
        alignSelf: "center",
        width: "90%",
        height: 25,
        marginTop: 14,
        marginBottom: 14,
        flexDirection: "column",
        alignItems: "flex-end"
    },
    logOutWarningMessage: {
        color: "#C62222",
        fontFamily: "Tajawal-Regular",
        fontSize: 10,
        marginTop: 5
    },
    line: {
        top: 50,
        height: 1,
        borderStyle: "solid",
        opacity: 1,
        backgroundColor: "#E6E9F0",
    },
    addImage: {
        height: 208,
        width: 218,
        resizeMode: "stretch",
    },
    iconIonicIosArrowImage: {
        borderRadius:10,
        resizeMode: "contain",
        backgroundColor: "#F7FAFC",
        // position: "absolute",
        right: 5,
        top: 5,
        width: 36,
        height: 36,
        padding:5
    },
});

CustomModal.PropTypes = {
    props: PropTypes.object,
    visible: PropTypes.bool,
    data: PropTypes.object = {
        title: PropTypes.string,
        message: PropTypes.string,
        button1Text: PropTypes.string,
        button2Text: PropTypes.string
    },
    button1: PropTypes.string,
    button2: PropTypes.string
};

export default CustomModal;