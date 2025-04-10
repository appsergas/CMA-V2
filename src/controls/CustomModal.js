import {
    Dimensions, Modal, StyleSheet, Text, TouchableHighlight,
    View, Image, TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { ScrollView } from 'react-native-gesture-handler';
import { XIcon } from '../../assets/icons';

const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));

    useEffect(() => {
        const onChange = result => {
            setScreenData(result.screen);
        };
        Dimensions.addEventListener('change', onChange);
        return () => Dimensions.removeEventListener('change', onChange);
    }, []);

    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
    };
};

function CustomModal(props) {
    const {
        visible,
        onPress,
        data = {},
        button1,
        button2,
        onButton1 = () => { },
        onButton2 = () => { },
        onClose = () => { },
        titleText = {},
        logOutWarningMessage = false,
        close = true,
        position = 'center' // <-- NEW PROP
    } = props;

    const screenData = useScreenDimensions();

    return (
        <View style={styles.centeredView}>
        <Modal animationType="slide" transparent visible={visible}>
            <View
                style={[
                    styles.modal,
                    screenData.isLandscape && styles.modalLandscape,
                    position === 'bottom' && styles.modalBottom // aligns modal to bottom
                ]}
            >
                <View
                    style={[
                        styles.modalView,
                        position === 'bottom' && styles.modalViewBottom // adds bottom margin
                    ]}
                >
                    <View style={[styles.modalViewInnerContainer, titleText]}>

                            {/* CLOSE ICON */}
                            {close && (
                                <TouchableOpacity
                                    style={styles.closeIcon}
                                    onPress={onClose}
                                >
                                    <View style={styles.iconWrapper}><XIcon /></View>
                                </TouchableOpacity>
                            )}

                            {/* TITLE */}
                            {!!data.title && data.title !== 'Test' && (
                                <Text style={styles.deleteThisContactTitle}>{data.title}</Text>
                            )}

                            {/* IMAGE */}
                            {!!data.uri && (
                                <Image
                                    style={data.imageStyle || styles.addImage}
                                    source={data.uri}
                                />
                            )}

                            {/* MESSAGE TEXT */}
                            {!!data.message && data.message !== 'Test' && !data.uri && (
                                <ScrollView style={styles.messageScroll}>
                                    {data.message.split('\\n').map((line, index) => (
                                        <Text key={index} style={styles.deleteThisContactText}>
                                            {/* {line} */}
                                            {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return (
                                                        <Text key={i} style={{ fontWeight: 'bold' }}>
                                                            {part.replace(/\*\*/g, '')}
                                                        </Text>
                                                    );
                                                }
                                                return part;
                                            })}
                                        </Text>
                                    ))}
                                </ScrollView>
                            )}

                            {/* CUSTOM VIEW */}
                            {data.view && (
                                <View style={styles.customViewWrapper}>{data.view}</View>
                            )}

                            {/* BUTTONS */}
                            {(button1 || button2) && (
                                <View
                                    style={button1 && button2 ? styles.modalButtonContainer : styles.modalSingleButtonContainer}
                                >
                                    {/* {button1 && (
                                        <TouchableHighlight underlayColor="none" onPress={onButton1}>
                                            <View style={button1 && button2 ? styles.cancelView : styles.cancelView12}>
                                                <Text style={styles.cancelText}>{data.button1Text || 'Cancel'}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    )}
                                    {button2 && (
                                        <TouchableHighlight underlayColor="none" onPress={onButton2}>
                                            <View style={styles.deleteView}>
                                                <Text style={styles.deleteText}>{data.button2Text || 'Confirm'}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    )} */}
                                </View>
                            )}

                            {/* LOGOUT WARNING */}
                            {
                            logOutWarningMessage 
                            // && (
                            //     <Text style={styles.logOutWarningMessage}>
                            //         If you click on the logout, App will be closed for security reasons.
                            //     </Text>
                            // )
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalViewBottom: {
        marginBottom: 110, // adjust this value as needed
    },
    centeredView: {
        backgroundColor: "transparent",
        width: "100%",
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: "center", // default centered
        alignItems: "center",
        paddingHorizontal: 15,
    },
    modalLandscape: {
        // paddingHorizontal: 30,
    },
    modalBottom: {
        justifyContent: 'flex-end' // for bottom sheet
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 22,
        paddingVertical: 1,
        paddingHorizontal: 10,
        width: "100%",
        maxWidth: 420,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    modalViewInnerContainer: {

        marginTop:20,
        justifyContent: "center",
        alignSelf: "center",
        width: "100%"
    },
    closeIcon: {
        alignSelf: 'flex-end',
    },
    iconWrapper: {
        borderRadius: 10,
        backgroundColor: "#F7FAFC",
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteThisContactTitle: {
        color: "#102D4F",
        fontFamily: "Tajawal-Bold",
        fontSize: 18,
        marginTop: 10,
        marginBottom: 5,
        textAlign: "left"
    },
    // deleteThisContactText: {
    //     color: "#808C90",
    //     fontFamily: "Tajawal-Regular",
    //     fontSize: 14,
    //     lineHeight: 19.6,
    //     letterSpacing: 0.2,
    //     textAlign: 'justify',
    //     marginHorizontal: 15,
    //     marginBottom: 5
    // },
    deleteThisContactText: {
        color: "#000000",
        fontFamily: "Tajawal-Regular",
        fontSize: 14,
        // textAlign: 'justify',
        marginHorizontal: 15,
        marginBottom: 5,

        fontWeight: '500',
        lineHeight: 17.6,
        letterSpacing: 0.2,
        textAlignVertical: 'center',

    },
    messageScroll: {
        marginTop: 15,
        maxHeight: 200
    },
    customViewWrapper: {
        marginTop: 0,
        width: "95%"
    },
    modalButtonContainer: {
        alignSelf: "center",
        justifyContent: "center",
        // width: 300,
        marginTop: 20,
        flexDirection: "row"
    },
    modalSingleButtonContainer: {
        alignSelf: "flex-end",
        width: "100%",
        marginTop: 20
    },
    cancelView: {
        backgroundColor: "#102D4F",
        borderRadius: 4,
        width: 95,
        height: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    cancelView12: {
        backgroundColor: "rgb(79, 194, 212)",
        borderRadius: 4,
        width: 95,
        height: 30,
        justifyContent: "center",
        alignItems: 'center'
    },
    cancelText: {
        color: "#FFF",
        fontFamily: "Tajawal-Bold",
        fontSize: 12,
        textAlign: "center",
    },
    deleteView: {
        backgroundColor: "transparent",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#102D4F",
        width: 100,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20
    },
    deleteText: {
        color: "#102D4F",
        fontFamily: "Tajawal-Bold",
        fontSize: 12,
        textAlign: "center"
    },
    logOutWarningMessage: {
        color: "#C62222",
        fontFamily: "Tajawal-Regular",
        fontSize: 10,
        marginTop: 10,
        textAlign: "center"
    },
    addImage: {
        height: 208,
        width: 218,
        resizeMode: "contain",
        marginVertical: 20
    }
});

CustomModal.propTypes = {
    props: PropTypes.object,
    visible: PropTypes.bool,
    data: PropTypes.shape({
        title: PropTypes.string,
        message: PropTypes.string,
        uri: PropTypes.any,
        view: PropTypes.element,
        button1Text: PropTypes.string,
        button2Text: PropTypes.string
    }),
    button1: PropTypes.bool,
    button2: PropTypes.bool,
    onButton1: PropTypes.func,
    onButton2: PropTypes.func,
    onClose: PropTypes.func,
    titleText: PropTypes.object,
    logOutWarningMessage: PropTypes.bool,
    close: PropTypes.bool,
    position: PropTypes.oneOf(['center', 'bottom']) // NEW PROP TYPE
};

export default CustomModal;
