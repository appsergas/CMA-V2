import Mainstyles from '../../styles/globalStyles'

import styles from './OcrTestStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, Switch, ImageBackground } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'  
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'
import HomeMainCard from '../../components/HomeMainCard';
import Toast from '../../controls/Toast'
import Modal from '../../controls/Modal'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { RNCamera } from 'react-native-camera';
import { API_PATH } from '../../services/api/data/data/api-utils';
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import { updateUserDetails } from '../../stores/actions/user.action';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';
import CircleIconWrapper from "../../components/molecules/CircleIconWrapper";

import { ArrowIcon, IdentificationIcon, ScanIcon, TypeCursorIcon, XIcon, FlashIcon } from '../../../assets/icons'



class OcrTest extends Component {
    constructor(props) {
        super(props)
        AsyncStorage.getItem('language', (err, res) => {
            if (res != null) {
                if (res == "ar") {
                    setI18nConfig(res, true);
                    this.forceUpdate();
                } else {
                    setI18nConfig(res, false);
                    this.forceUpdate();
                }
            } else {
                setI18nConfig("en", false);
                this.forceUpdate();
            }
        })
        this.state = {
            existingDetails: null,
            updateId: false,
            canDetextText: true,
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                getHelpDocsCalled: true
            },
            getEidDetailsCalled: false,
            updateEidCalled: false,
            emiratesIdNumber: "",
            // emiratesIdNumber: "784199618173506",
            fullName: "",
            showToast: false,
            toastMessage: "",
            emiratesIdFront: null,
            emiratesIdBack: null,
            // emiratesIdFront: {
            //     "height": 4000,
            //     "uri": "file:///data/user/0/com.sergas.customer/cache/Camera/4ce7d300-d6aa-42ec-81a1-f7222f7d73ad.jpg",
            //     "width": 3000,
            //     "pictureOrientation": 1,
            //     "deviceOrientation": 1
            // },
            // emiratesIdBack: {
            //     "height": 4000,
            //     "uri": "file:///data/user/0/com.sergas.customer/cache/Camera/1ac96800-149a-4ca8-8950-b1ebe1f848e2.jpg",
            //     "width": 3000,
            //     "pictureOrientation": 1,
            //     "deviceOrientation": 1
            // },
            showModal: false,
            readingResult: "",
            recognizedFrontText: null,
            torch: 'off',
            editName: false,
            newName: '',
            newIdNumber: '',
            stayStill: 0,
            insideFront: false,
            insideBack: false
        }
        this.scrollView = React.createRef()
    }

    componentWillMount() {
        this.setState({
            getEidDetailsCalled: true
        }, async () => {
            this.props.getEidDetails({ "mobile": await AsyncStorage.getItem("sergas_customer_mobile_number") })
        })

    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { getEidDetailsResult, updateEidResult, getUserDetailsResult } = nextProps;

        if (this.state.getEidDetailsCalled) {
            this.setState({
                getEidDetailsCalled: false
            }, () => {
                if (getEidDetailsResult && getEidDetailsResult.content && getEidDetailsResult.content.USER_ID) {
                    this.setState({
                        existingDetails: getEidDetailsResult.content
                    })
                    this.props.updateUserDetails(getEidDetailsResult.content)
                } else {

                }
            })
        }

        if (this.state.updateEidCalled) {
            this.setState({ updateEidCalled: false }, () => {
                if (updateEidResult && updateEidResult.content && updateEidResult.content.STATUS && (updateEidResult.content.STATUS == "SUCCESS")) {
                    this.setState({
                        showModal: true,
                        readingResult: updateEidResult.content.MSG,
                        getEidDetailsCalled: true
                    }, async () => {
                        this.props.getEidDetails({ "mobile": await AsyncStorage.getItem("sergas_customer_mobile_number") })
                    })
                } else {
                    if (updateEidResult.content && updateEidResult.content.MSG) {
                        this.setState({
                            showModal: true,
                            readingResult: updateEidResult.content.MSG
                        })
                    } else {
                        this.setState({
                            showModal: true
                        })
                    }
                }
            })
        }
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }

    handleLocalizationChange = () => {
        AsyncStorage.getItem('language', (err, res) => {
            if (res != null) {
                if (res == "ar") {
                    setI18nConfig(res, true);
                } else {
                    setI18nConfig(res, false);
                }
            } else {
                setI18nConfig('en', false);
            }
        })
        this.forceUpdate();
    }

    handleSendOtp = () => {
        this.props.navigation.navigate("Otp")
    }

    toastIt = (message) => {
        this.setState({
            showToast: true,
            toastMessage: message,
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
    }

    formatEid = (eid) => {
        if (!eid) return "";
        return eid.replace(/\D/g, "") // Remove non-numeric characters
            .replace(/(\d{3})(\d{4})(\d{7})(\d{1})/, "$1-$2-$3-$4");
    };

    renderContent() {
        return (
            <>
                <KeyboardAwareScrollView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                    style={{ flex: 1 }}
                    enabled
                    showsVerticalScrollIndicator={false}
                >
                    <ScrollView
                        ref={(ref) => (this.scrollView = ref)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollView}>
                        {
                            this.state.getEidDetailsCalled ?
                                <ActivityIndicator size={'small'} color={"#102D4F"} />
                                :
                                (this.state.existingDetails && !this.state.updateId && (this.state.existingDetails.EID_IMAGE_URL != "")) ?
                                    <>
                                        <View style={styles.bodyview}>
                                            <Text style={styles.labelText}>Full Name</Text>
                                            <View style={styles.valueRow}>
                                                <TypeCursorIcon size={20} color="#102D4F" style={styles.verifiedIcon} />
                                                <Text style={styles.accountNumberText}>Eslam Abdelkhaleq</Text>
                                            </View>
                                            <TouchableOpacity style={styles.editButton}>
                                                <Text style={styles.editText}>Edit</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.bodyview}>
                                            <Text style={styles.labelText}> Emirates ID Number</Text>
                                            <View style={styles.valueRow}>
                                                <IdentificationIcon width={30} height={30} strokeWidth="1.5" />
                                                <Text style={styles.accountNumberText}>{this.formatEid(this.state.existingDetails.EID)}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.bodyview}>
                                            <Text style={styles.labelText}> Emirates ID</Text>
                                            <View style={styles.imgRow}>
                                                <Image style={styles.addImage} source={{ uri: API_PATH + "/Documents/App/" + this.state.existingDetails.EID_IMAGE_URL.split(",")[0] }} />
                                            </View>
                                            <View style={styles.imgRow}>
                                                <Image style={styles.addImage} source={{ uri: API_PATH + "/Documents/App/" + this.state.existingDetails.EID_IMAGE_URL.split(",")[1] }} />
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.Labellink}
                                            // onPress={this.handleSubmit}
                                            onPress={() => {
                                                this.setState({
                                                    updateId: true
                                                })
                                            }}
                                        >
                                            {
                                                (this.state.apiCallFlags.requestDisconnectionApiCalled || this.state.apiCallFlags.updatePaymentApiCalled || this.state.makePaymentClicked) ?
                                                    <ActivityIndicator size='small' color='white' /> :
                                                    <View style={styles.LabelContainer}>
                                                        <ScanIcon />
                                                        <Text style={styles.Labeltxt}>  Re Capture</Text>
                                                    </View>
                                            }
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.buttonStyle}>
                                            <Text style={styles.buttonLabelStyle}>  Submit</Text>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    this.state.emiratesIdBack == null ?
                                        <View style={{ width: "100%" }}>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                {/* Left-side X icon */}
                                                <TouchableOpacity
                                                    style={{}} // optional spacing
                                                    onPress={() => {
                                                        this.setState({ updateId: false });
                                                    }}
                                                >
                                                    <XIcon color={"#FFFFFF"} />
                                                </TouchableOpacity>

                                                {/* Centered text */}
                                                <View style={{ flex: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0 }}>
                                                    <Text style={styles.accountNumberTextScan}>
                                                        {this.state.emiratesIdFront == null ? "Scan Front Emirates ID" : "Scan Back Emirates ID"}
                                                    </Text>
                                                </View>


                                            </View>

                                            <View
                                                style={{
                                                    marginTop: 80,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {/* <View style={{ justifyContent: 'center', height: 30, width: 30, borderRadius: 16, backgroundColor: "#E2E2E2", alignItems: 'center', borderColor: "#102D4F", borderWidth: 2, marginBottom: 10, justifyContent: "center" }}>
                                                    <Text style={{ fontSize: 16, color: "#102D4F", fontFamily: "Tajawal-Bold" }}>
                                                        {
                                                            this.state.emiratesIdFront == null ? "1" : "2"
                                                        }
                                                    </Text>
                                                </View> */}



                                                <RNCamera
                                                    ref={ref => { this.camera = ref; }}
                                                    flashMode={this.state.torch}
                                                    zoom={Platform.OS == 'ios' ? 0.005 : 0}
                                                    onPictureTaken={() => {

                                                    }}
                                                    style={{
                                                        height: 210,
                                                        width: 350,
                                                        alignSelf: 'center',
                                                        borderWidth: this.state.stayStill > 0 ? 4 : 0.4,
                                                        borderColor: this.state.stayStill > 0 ? "#FF8D00" : "#102D4F",
                                                        borderStyle: "solid",
                                                        borderRadius: 4,
                                                        overflow: 'hidden',
                                                        justifyContent: 'center'
                                                    }}
                                                    trackingEnabled
                                                    onTextRecognized={(object) => {
                                                        const { textBlocks } = object;
                                                        this.setState({ recognizedFrontText: textBlocks })
                                                        const textRecognition = textBlocks;
                                                        if (this.state.emiratesIdFront == null) {
                                                            const EID = "784-";
                                                            const NAME = "Name";
                                                            const idNumberIndex = textRecognition.findIndex((item) => item.value.match(EID));
                                                            const nameIndex = textRecognition.findIndex((item) => item.value.match(NAME));
                                                            const uaeIndex = textRecognition.findIndex((item) => item.value.toUpperCase().match("UNITED ARAB EMIRATES"));
                                                            const idCardIndex = textRecognition.findIndex((item) => item.value.match("Resident Identity Card"));
                                                            let alertMsg = idNumberIndex.toString() + "\n aaa" + nameIndex.toString() + "bbb"
                                                            if ((idNumberIndex > -1) && (nameIndex > -1) && (uaeIndex > -1)
                                                                && /^\d{15}$/.test(textRecognition[idNumberIndex].value.slice(textRecognition[idNumberIndex].value.indexOf("784-")).toString().replace(/-/g, ""))
                                                                && /^[a-zA-Z\s\.]+$/.test(textRecognition[nameIndex].value.toString().replace(/Name/g, "").replace(/: /g, "").replace(/:/g, ""))) {
                                                                this.setState({
                                                                    stayStill: this.state.stayStill + 1,
                                                                    insideFront: true
                                                                }, () => {
                                                                    // setTimeout(() => {
                                                                    if (this.state.stayStill == 5) {
                                                                        this.camera.takePictureAsync({
                                                                            base64: true,
                                                                            quality: 0.1,
                                                                            forceUpOrientation: true,
                                                                            orientation: 'portrait'
                                                                        }).then(res => {
                                                                            this.setState({
                                                                                emiratesIdFront: res
                                                                            }, () => setTimeout(() => {
                                                                                this.setState({
                                                                                    stayStill: 0
                                                                                }, () => {
                                                                                    this.toastIt("ID Front scanned successfully", false)
                                                                                })
                                                                            }, 1000))

                                                                        }
                                                                        )

                                                                        if (idNumberIndex > -1) {
                                                                            this.setState({
                                                                                emiratesIdNumber: textRecognition[idNumberIndex].value.slice(textRecognition[idNumberIndex].value.indexOf("784-")).toString().replace(/-/g, ""),
                                                                            })
                                                                        }
                                                                        if (nameIndex > -1) {
                                                                            this.setState({
                                                                                fullName: textRecognition[nameIndex].value.toString().replace(/Name/g, "").replace(/Date of Birth/g, "").replace(/: /g, "").replace(/:/g, ""),
                                                                            })
                                                                        }

                                                                    }
                                                                    // },1500)
                                                                })


                                                                // this.camera.pausePreview()



                                                            } else {
                                                                this.setState({
                                                                    stayStill: 0,
                                                                    insideFront: false
                                                                })

                                                                // this.toastIt("Could not recognize the card", false)
                                                            }
                                                        } else {
                                                            const EID = "Issuing Place";
                                                            const CardNumber = "Card Number";

                                                            const cardNumberIndex = textRecognition.findIndex((item) => item.value.match(CardNumber));
                                                            const idNumberIndex = textRecognition.findIndex((item) => item.value.match(this.state.emiratesIdNumber));
                                                            if ((cardNumberIndex > -1) && (idNumberIndex > -1)) {
                                                                this.setState({
                                                                    stayStill: this.state.stayStill + 1,
                                                                    insideBack: true
                                                                }, () => {
                                                                    if (this.state.stayStill == 2) {
                                                                        this.camera.takePictureAsync({
                                                                            base64: true,
                                                                            quality: 0.1,
                                                                            forceUpOrientation: true,
                                                                            orientation: 'portrait'
                                                                        }).then(res => {
                                                                            this.setState({
                                                                                emiratesIdBack: res
                                                                            }, () => setTimeout(() => {
                                                                                this.setState({
                                                                                    stayStill: 0
                                                                                }, () => {
                                                                                    this.toastIt("ID Rear scanned successfully", false)
                                                                                })
                                                                            }, 1000))
                                                                        }
                                                                        )


                                                                        if (cardNumberIndex > -1) {
                                                                        }

                                                                    }
                                                                })
                                                                // this.camera.pausePreview()

                                                            } else {
                                                                this.setState({
                                                                    stayStill: 0,
                                                                    insideFront: false
                                                                })
                                                                // this.toastIt("Could not recognize the card", false)
                                                            }
                                                        }




                                                    }}
                                                >
                                                    {
                                                        this.state.stayStill ? null : <Image
                                                            source={this.state.emiratesIdFront == null ? require('../../../assets/images/eidScanFront1.gif') : require('../../../assets/images/FlipCard1.gif')}
                                                            style={{
                                                                height: 200,
                                                                width: 300,
                                                                alignSelf: 'center',
                                                                borderWidth: 0.4,
                                                                borderColor: "#102D4F",
                                                                borderStyle: "solid",
                                                                borderRadius: 40,
                                                                resizeMode: 'stretch',
                                                                opacity: this.state.emiratesIdFront == null ? 0.4 : 0.8
                                                            }}
                                                        />
                                                    }

                                                </RNCamera>
                                                {this.state.stayStill ?
                                                    <Text style={{
                                                        fontFamily: "Tajawal-Bold",
                                                        fontSize: 28,
                                                        color: "#FF8D00", alignSelf: 'center'
                                                    }}>Scanning... Hold still</Text>
                                                    : null}
                                                <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'flex-end', alignItems: 'center', marginTop:"80%",marginRight: 10 }}>
                                                    <Text style={styles.inputLabelStyle} >
                                                        {/* Flash light */}
                                                    </Text>
                                                    <CircleIconWrapper
                                                        backgroundColor={this.state.torch === 'torch' ? "#FFFFFF" : "#5A6B85"}
                                                        onPress={() => {
                                                            this.setState({
                                                                torch: this.state.torch === 'torch' ? 'off' : 'torch'
                                                            });
                                                        }}
                                                    >
                                                        <FlashIcon isOn={this.state.torch === 'torch'} />
                                                    </CircleIconWrapper>

                                                </View>
                                            </View>
                                        </View>
                                        :
                                        this.state.emiratesIdBack != null != "" ?
                                            <View style={{ marginTop: 40, width: "100%", alignItems: 'center' }}>
                                                <Image source={{ uri: this.state.emiratesIdFront.uri }}
                                                    style={{
                                                        height: 200,
                                                        width: 300,
                                                        alignSelf: 'center',
                                                        // borderWidth: 3,
                                                        borderColor: "#102D4F",
                                                        borderStyle: "solid",
                                                        borderRadius: 4,
                                                        overflow: 'hidden'
                                                    }} />
                                                <Image source={{ uri: this.state.emiratesIdBack.uri }}
                                                    style={{
                                                        height: 200,
                                                        width: 300,
                                                        alignSelf: 'center',
                                                        // borderWidth: 3,
                                                        borderColor: "#102D4F",
                                                        borderStyle: "solid",
                                                        borderRadius: 4,
                                                        overflow: 'hidden',
                                                        marginTop: 20
                                                    }} />

                                                <View style={styles.cardBodyRow}>
                                                    <View style={styles.cardBodyColumnLeft}>
                                                        <Text style={styles.cardBodyText}>Emirates ID Number :</Text>
                                                    </View>
                                                    <View style={styles.cardBodyColumnRight}>
                                                        <Text style={styles.cardBodyText1}>{this.state.emiratesIdNumber}</Text>
                                                    </View>
                                                </View>


                                                <View style={{ ...styles.cardBodyRow, marginTop: 3 }}>
                                                    <View style={styles.cardBodyColumnLeft}>
                                                        <Text style={styles.cardBodyText}>Full Name :</Text>
                                                    </View>
                                                    <View style={{ ...styles.cardBodyColumnRight, width: "60%" }}>
                                                        <Text style={styles.cardBodyText1}>{this.state.fullName}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, width: "10%", alignSelf: 'flex-start', backgroundColor: "#FFFFFF", marginTop: 0 }}
                                                        onPress={() => {
                                                            this.setState({
                                                                newName: this.state.fullName,
                                                                newIdNumber: this.state.emiratesIdNumber,
                                                                editName: true
                                                            })
                                                        }}
                                                    >
                                                        <View style={{ ...styles.paymentDueRow2 }}
                                                        >
                                                            <Text style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Edit</Text>
                                                        </View>

                                                    </TouchableOpacity>
                                                </View>




                                                <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around' }}>
                                                    <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-start', backgroundColor: "#FFFFFF", marginTop: 10 }}
                                                        onPress={() => {
                                                            this.setState({
                                                                emiratesIdNumber: "",
                                                                fullName: "",
                                                                emiratesIdFront: null,
                                                                emiratesIdBack: null,
                                                            })
                                                        }}
                                                    >
                                                        <View style={{ ...styles.paymentDueRow2 }}
                                                        >
                                                            {/* <Image
                                                            source={require('../../../assets/images/backBlue.png')}
                                                            style={{ ...styles.clickImage, marginRight: 6, marginLeft: 0 }}
                                                        /> */}
                                                            <Text style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Re-Scan</Text>
                                                        </View>

                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{ ...styles.buttonStyle, width: "40%", alignSelf: 'flex-end', marginTop: 10 }}
                                                        onPress={() => {
                                                            this.setState({
                                                                updateEidCalled: true
                                                            }, async () => {
                                                                let attachments = []
                                                                if (this.state.emiratesIdFront != null) {
                                                                    attachments.push({ name: "emiratesidfront.jpg", value: this.state.emiratesIdFront.base64 });
                                                                }
                                                                if (this.state.emiratesIdBack != null) {
                                                                    attachments.push({ name: "emiratesidback.jpg", value: this.state.emiratesIdBack.base64 });
                                                                }
                                                                let reqBody = {
                                                                    "USER_ID": await AsyncStorage.getItem("sergas_customer_mobile_number"),
                                                                    "PARTY_NAME": this.state.fullName,
                                                                    "EID": this.state.emiratesIdNumber,
                                                                    "FILE_ATTACHMENTS": attachments
                                                                }
                                                                this.props.updateEid(reqBody)
                                                            })
                                                        }}
                                                    >
                                                        <View style={{ ...styles.paymentDueRow2 }}
                                                        >
                                                            {
                                                                this.state.updateEidCalled ?
                                                                    <ActivityIndicator size={'small'} color={"#FFFFFF"} />
                                                                    :
                                                                    <Text style={styles.buttonLabelStyle}>Save</Text>
                                                            }

                                                            {/* <Image
                                                            source={require('../../../assets/images/clickWhite.png')}
                                                            style={styles.clickImage}
                                                        /> */}
                                                        </View>
                                                        {/* <Text
                                                style={styles.buttonLabelStyle}>Next</Text> */}

                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            : null

                        }

                    </ScrollView>
                    {
                        this.state.showModal ?
                            <Modal
                                close={this.state.readingResult !== "EID updated successfully"}
                                onClose={() => this.setState({ showModal: false })}
                                visible={this.state.showModal}
                                // button1={true}
                                // button2={true}
                                onButton1={() => {
                                    this.setState({ showPaidModal: false })
                                }}
                                onButton2={() => {
                                    this.setState({ showPaidModal: false })
                                    this.makePayment()
                                }}
                                data={{
                                    // title: "Immediate Disconnection",
                                    // message: "Test",
                                    button1Text: "Close",
                                    button2Text: "Pay",
                                    uri: this.state.helpImageUrl,
                                    view: <View style={{ alignItems: 'center', width: "100%" }}>
                                        <Image style={{  resizeMode: "stretch", marginBottom: 30 }}
                                            source={this.state.readingResult == "EID updated successfully" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/InternetError.gif")}
                                        // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/InternetError.gif") }
                                        />

                                        <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.inputLabelStyle}>{this.state.readingResult == "EID updated successfully" ? "Thank You" : "Technical Error"} </Text>
                                        </View>

                                        <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                            <Text style={styles.modalMessageText}>{this.state.readingResult}</Text>
                                        </View>
                                        {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                        <TouchableOpacity
                                            style={{ ...styles.buttonStyle, width: "100%" }}
                                            onPress={() => {
                                                this.setState({
                                                    showModal: false
                                                })
                                                this.state.readingResult !== "EID updated successfully" ? null : this.props.route.params.fromOtp ? this.props.navigation.navigate("HomeBase") : this.props.navigation.goBack()
                                            }}
                                        >
                                            <Text
                                                style={styles.buttonLabelStyle}>{this.state.readingResult !== "EID updated successfully" ? "Try Again" : "Done"}</Text>
                                        </TouchableOpacity>

                                        {/* </View> */}

                                    </View>
                                }}
                                titleText={{ alignItems: 'center' }}
                            /> :
                            null
                    }

                    {
                        this.state.editName ?
                            // true ?
                            <Modal
                                close={false}
                                onClose={() => this.setState({ editName: false })}
                                visible={this.state.editName}
                                // visible={true}
                                onButton1={() => {
                                    this.setState({ editName: false })
                                }}
                                onButton2={() => {
                                    if ((/^[a-zA-Z\s\.]+$/.test(this.state.newName)) && (/^[0-9]{15}$/.test(this.state.newIdNumber))) {
                                        this.setState({
                                            fullName: this.state.newName,
                                            editName: false,
                                            emiratesIdNumber: this.state.newIdNumber
                                        })
                                    } else {

                                        // this.toastIt("Should contain only characters,dot or space.", false)
                                    }
                                }}
                                button1={true}
                                button2={true}
                                data={{
                                    button1Text: "Cancel",
                                    button2Text: "Done",
                                    title: "Edit your details",
                                    view: <View style={{ width: "100%", marginTop: -10 }}>
                                        {/* <View style={styles.cardBodyColumnLeft}> */}
                                        <Text style={{ ...styles.cardBodyText, fontSize: 14 }}>Full Name</Text>
                                        {/* </View> */}
                                        <TextInput
                                            Value={this.state.newName}
                                            OnChange={(value) => {
                                                this.setState({ newName: value })
                                            }}
                                            Style={{ borderColor: "#848484" }}
                                        />
                                        {
                                            !/^[a-zA-Z\s\.]+$/.test(this.state.newName) ?
                                                <Text style={{ fontSize: 12, color: "red" }}>
                                                    Should contain only characters,dot or space.
                                                </Text> : null
                                        }
                                        {/* <View style={{...styles.cardBodyColumnLeft, marginTop: 10, }}> */}
                                        <Text style={{ ...styles.cardBodyText, fontSize: 14, marginTop: 10 }}>Emirates ID Number</Text>
                                        {/* </View> */}
                                        <TextInput
                                            Value={this.state.newIdNumber}
                                            OnChange={(value) => {
                                                this.setState({ newIdNumber: value })
                                            }}
                                            Style={{ borderColor: "#848484" }}
                                            keyboardType={"numeric"}
                                        />
                                        {
                                            !/^[0-9]{15}$/.test(this.state.newIdNumber) ?
                                                <Text style={{ fontSize: 12, color: "red" }}>
                                                    Should contain only numbers. Must be 15 digits.
                                                </Text> : null
                                        }
                                    </View>
                                }}
                                titleText={{ alignItems: 'center' }}
                            /> :
                            null
                    }


                </KeyboardAwareScrollView>
                {this.state.showToast ? (
                    <Toast message={this.state.toastMessage} isImageShow={false} />
                ) : null}
            </>
        );
    }


    render() {
        return (
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    {
                        this.state.existingDetails && !this.state.updateId && (this.state.existingDetails.EID_IMAGE_URL != "") && (
                        // !this.state.updateId && (
                            <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                                <View style={Mainstyles.headerLeft}>
                                    <TouchableOpacity
                                        style={Mainstyles.backbutton}
                                        onPress={() => this.props.navigation.goBack()}
                                    >
                                        <ArrowIcon direction={"left"} size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                    <View style={Mainstyles.textContainer}>
                                        <View style={Mainstyles.nameRow}>
                                            <Text style={Mainstyles.welcomeLabel}>Emirates ID</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    {/* 

                    <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                    </InfoContainer> */}

                    {
                        this.state.updateId ? (
                            <View style={{ flexGrow: 1 }}>
                                {this.renderContent()}
                            </View>
                        ) : (
                            <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                                {this.renderContent()}
                            </InfoContainer>
                        )
                    }
                </SafeAreaView>
            </LinearGradient>
        )
    }

}

const mapStateToProps = ({ contractsReducer, userReducer }) => {
    return {
        contracts: contractsReducer.contracts,
        userDetails: userReducer.userDetails
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateContracts: (data) => dispatch(updateContracts(data)),
        updateUserDetails: (data) => dispatch(updateUserDetails(data))
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(OcrTest, {
    methods: {
        getHelpDocs: {
            type: 'get',
            moduleName: 'api',
            url: 'getHelpDocs',
            authenticate: true,
        },
        updateEid: {
            type: 'post',
            moduleName: 'api',
            url: 'updateEID',
            authenticate: true,
        },
        getEidDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getMobileUserDetails',
            authenticate: true,
        },
    }
}))



