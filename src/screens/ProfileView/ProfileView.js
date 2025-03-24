
import styles from './ProfileViewStyles'

import React, { Component, useState } from 'react'
import { View, Text, Image, Button, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
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
//import Toast from '../../controls/Toast'
import Modal from '../../controls/Modal'
import LTSModal from '../../controls/LTSModal'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { RNCamera } from 'react-native-camera';
import { API_PATH } from '../../services/api/data/data/api-utils';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import OtpInputs from 'react-native-otp-inputs';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
class ProfileView extends Component {
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
            reScan: false,
            canDetextText: true,
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                getHelpDocsCalled: true
            },
            getUserDetailsCalled: false,
            updateEidCalled: false,
            emiratesIdNumber: "",
            // emiratesIdNumber: "784199618173506",
            fullName: "",
            showToast: false,
            toastMessage: "",
            emiratesIdFront: null,
            emiratesIdBack: null,
            isModalVisible: false, setIsModalVisible: false,
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
            showUpdateModal: false,
            showEmailUpdateModal: false,
            otpPopupVisible: false,
            setOTPPopupVisible: false,
            mobileOTP: "",
            emailOTP: "",
            readingResult: "",
            sendOTPCalled: false,
            verifyOTPCalled: false,
            mobileNumber: "",
            setNewMobileNumber: "",
            setNewEmail: "",
            errormsg: false,
            otpSent: false,
            motp: "",
            eotp: "",
            mobileVerified: false,
            emailOtpEnabled: false
        }
        this.scrollView = React.createRef()

    }

    handleSendOTP = () => {
        try {
            const { existingDetails, setNewMobileNumber, mobileNumber } = this.state;
            if (setNewMobileNumber === mobileNumber) {
                this.setState({
                    errormsg: "Error: Same number already in use.",
                    verifyOTPCalled: false
                });
                return;
            }
            // Validation checks
            if (!existingDetails.EMAIL || !setNewMobileNumber || !mobileNumber) {
                this.setState({
                    errormsg: "Error : Fields are required.",
                    sendOTPCalled: false
                });

                //this.setState({ showUpdateModal: false });
                //this.state.readingResult !== "Email / Mobile updated successfully" ? null : this.props.navigation.goBack();
                return;
            }

            // Clear any previous error message
            this.setState({ errormsg: null, sendOTPCalled: true });

            // Call the sendOTP function with the required details
            this.props.sendOTP({
                EmailId: existingDetails.EMAIL === "" ? "Email Not Updated" : existingDetails.EMAIL,
                MobileNumber: setNewMobileNumber,
                Mobile: ""
            });

        } catch (error) {
            //console.error("Error sending OTP: ", error);
            this.setState({ errormsg: "Error : Unable to send OTP." });
        }
    }
    handleSendEOTP = () => {
        try {
            const { mobileNumber, setNewEmail } = this.state;
            if (setNewEmail === this.state.existingDetails.EMAIL) {
                this.setState({
                    errormsg: "Error: Same email already in use.",
                    verifyOTPCalled: false
                });
                return;
            }
            // Validation checks
            if (!setNewEmail || !mobileNumber) {
                this.setState({
                    errormsg: "Error : Fields are required.",
                    sendOTPCalled: false
                });

                return;
            }

            // Clear any previous error message
            this.setState({ errormsg: null, sendOTPCalled: true });
            //console.log('Email Id : ', setNewEmail,'mobile No ', mobileNumber);

            this.props.sendOTP({
                EmailId: setNewEmail,
                MobileNumber: "",
                Mobile: mobileNumber
            });

        } catch (error) {
            //console.error("Error sending OTP: ", error);
            this.setState({ errormsg: "Error : Unable to send OTP." });
        }
    }

    handleVerifyUpdate = () => {
        try {
            const { existingDetails, setNewMobileNumber, eotp, motp } = this.state;

            // Validation checks
            if (!existingDetails.EMAIL || !setNewMobileNumber || !eotp || !motp) {
                this.setState({
                    errormsg: "Error: All fields are required.",
                    verifyOTPCalled: false
                });
                return;
            }

            // Clear any previous error message
            this.setState({ errormsg: null, verifyOTPCalled: true });
            this.props.verifyOTP({
                EmailId: existingDetails.EMAIL,
                MobileNumber: setNewMobileNumber,
                EmailOTP: eotp,
                MobileOTP: motp
            });

        } catch (error) {
            //console.error("Error verifying OTP: ", error);
            this.setState({ errormsg: "Error: Unable to verify OTP." });
        }
    }
    handleVerifyEUpdate = () => {
        try {
            const { mobileNumber, setNewEmail, eotp, motp } = this.state;
            //console.log('Old Number : ', mobileNumber, 'new email ', setNewEmail,'eotp ', eotp,'mobile ', motp);

            if (!mobileNumber || !setNewEmail || !eotp || !motp) {
                this.setState({
                    errormsg: "Error: All fields are required.",
                    verifyOTPCalled: false
                });
                return;
            }

            // Clear any previous error message
            this.setState({ errormsg: null, verifyOTPCalled: true });
            this.props.verifyOTP({
                EmailId: setNewEmail,
                MobileNumber: mobileNumber,
                EmailOTP: eotp,
                MobileOTP: motp
            });

        } catch (error) {
            //console.error("Error verifying OTP: ", error);
            this.setState({ errormsg: "Error: Unable to verify OTP." });
        }
    }

    handleMobileOTPValidation = () => {
        try {
            this.setState({ verifyOTPCalled: true });
            this.props.verifyOTP({
                EmailId: this.state.existingDetails.EMAIL == "" ? "Email Not Updated" : this.state.existingDetails.EMAIL,
                MobileNumber: this.state.setNewMobileNumber,
                EmailOTP: this.state.eotp,
                MobileOTP: this.state.motp
            });

        } catch (error) {
            //console.error("Error sending OTP: ", error);
        }
        //this.setState({ emailOtpEnabled: true });
        //this.setState({ mobileVerified: false });
    }

    handleEmailOTPValidation = () => {
        // Make API call to validate email OTP
        // Example:
        // fetch('your-api-endpoint', {
        //     method: 'POST',
        //     body: JSON.stringify({ otp: this.state.otp }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        //     // Update state or perform actions based on response
        // })
        // .catch(error => console.error('Error:', error));
    }
    async componentWillMount() {
        this.setState({
            getUserDetailsCalled: true,
            mobileNumber: await AsyncStorage.getItem("sergas_customer_mobile_number")
        }, async () => {
            this.props.getUserDetails({ "mobile": this.state.mobileNumber })
        })

    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { getUserDetailsResult, updateEidResult, sendOTPResult, verifyOTPResult } = nextProps;

        if (this.state.getUserDetailsCalled) {
            this.setState({
                getUserDetailsCalled: false
            }, () => {
                if (getUserDetailsResult && getUserDetailsResult.content && getUserDetailsResult.content.USER_ID) {
                    this.setState({
                        existingDetails: getUserDetailsResult.content
                    })
                } else {

                }
            })
        }

        if (this.state.updateEidCalled) {
            this.setState({ updateEidCalled: false }, () => {
                if (updateEidResult && updateEidResult.content && updateEidResult.content.STATUS && (updateEidResult.content.STATUS == "SUCCESS")) {
                    this.setState({
                        showModal: true,
                        readingResult: updateEidResult.content.MSG
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
        if (this.state.sendOTPCalled) {
            this.setState({ sendOTPCalled: false }, () => {
                const { sendOTPResult } = this.props; // Assuming sendOTPResult is passed via props

                if (sendOTPResult && sendOTPResult.content && sendOTPResult.content.STATUS) {
                    if (sendOTPResult.content.STATUS === "SUCCESS") {
                        this.setState({
                            otpSent: true,
                            mobileVerified: true,
                            errormsg: sendOTPResult.content.MSG || "OTP sent successfully."
                        });
                    } else {
                        this.setState({
                            otpSent: false,
                            mobileVerified: false,
                            errormsg: sendOTPResult.content.MSG || "Failed to send OTP."
                        });
                    }
                } else {
                    this.setState({
                        otpSent: false,
                        mobileVerified: false,
                        errormsg: "Technical Error: Unable to send OTP."
                    });
                }
            });
        }

        if (this.state.verifyOTPCalled) {
            this.setState({ verifyOTPCalled: false }, () => {
                const { verifyOTPResult } = this.props; // Assuming verifyOTPResult is passed via props

                if (verifyOTPResult && verifyOTPResult.content && verifyOTPResult.content.STATUS) {
                    this.setState({
                        errormsg: verifyOTPResult.content.MSG

                    });
                    if (verifyOTPResult.content.STATUS === "SUCCESS") {
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: 'Congrats! Your Update Request has been Success',
                        })
                        this.setState({ showUpdateModal: false, otpSent: false, mobileVerified: false, errormsg: '' });
                        this.setState({ showEmailUpdateModal: false, otpSent: false, mobileVerified: false, errormsg: '' });

                    }
                    //this.state.readingResult !== "Email / Mobile updated successfully" ? null : this.props.navigation.goBack();
                } else {
                    this.setState({
                        errormsg: "Unexpected error occurred during OTP verification."
                    });
                }
            });
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


    render() {
        return (
            <AlertNotificationRoot>


                <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                    <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_20 : Dimensions.HP_10 }}>
                        <View style={{ flexDirection: "row", }}>
                            <View style={styles.headerCol1}>
                                <View style={[{ width: '90%', flexDirection: 'row', height: Dimensions.HP_10, paddingTop: Dimensions.HP_3, alignItems: "center" }]}>
                                    <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                        <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
                                    </TouchableOpacity>
                                    <Text style={styles.welcomeLabel} >
                                        Profile
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                        </View>
                    </View>

                    <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}>
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
                                    this.state.getUserDetailsCalled || (this.state.existingDetails == null) ?
                                        <ActivityIndicator size={'small'} color={"#102D4F"} />
                                        :
                                        <>
                                            <TouchableOpacity style={{ ...styles.cardView, ...{ paddingHorizontal: 15, minHeight: 50, flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start', borderWidth: 0, borderRadius: 4 } }}>
                                                <Icon name="person-outline" style={styles.TitleIcon} />
                                                <Text style={styles.accountNumberText}>{this.state.existingDetails.PARTY_NAME == "" ? "Name Not Updated" : this.state.existingDetails.PARTY_NAME}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ ...styles.cardView, ...{ paddingHorizontal: 15, minHeight: 50, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', borderWidth: 0, borderRadius: 4 } }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name="mail-outline" style={styles.TitleIcon} />
                                                    <Text style={styles.accountNumberText}>{this.state.existingDetails.EMAIL == "" ? "Email Not Updated" : this.state.existingDetails.EMAIL}</Text>
                                                </View>

                                                <TouchableOpacity onPress={() => {
                                                    this.setState({
                                                        showEmailUpdateModal: true
                                                    })

                                                }}>
                                                    {this.state.existingDetails.EMAIL ? (
                                                        <Icon name="create-outline" style={styles.actionButtonIcon} />
                                                    ) : null}
                                                </TouchableOpacity>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ ...styles.cardView, ...{ paddingHorizontal: 15, minHeight: 50, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', borderWidth: 0, borderRadius: 4 } }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                    <Icon name="phone-portrait-outline" style={styles.TitleIcon} />
                                                    <Text style={styles.accountNumberText}>{this.state.mobileNumber}</Text>
                                                </View>

                                                <TouchableOpacity onPress={() => {
                                                    this.setState({
                                                        showUpdateModal: true
                                                    })

                                                }}>
                                                    <Icon name="create-outline" style={styles.actionButtonIcon} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>

                                        </>


                                }


                            </ScrollView>
                            {
                                this.state.showModal ?
                                    <Modal
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
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={this.state.readingResult == "EID updated successfully" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
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
                                                        this.state.readingResult !== "EID updated successfully" ? null : this.props.navigation.goBack()
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
                                this.state.showUpdateModal ?

                                    <LTSModal
                                        onClose={() => this.setState({ showUpdateModal: false })}
                                        visible={this.state.showUpdateModal}

                                        data={{
                                            uri: this.state.helpImageUrl,
                                            view:
                                                <View style={{ alignItems: 'center', marginTop: -40 }}>

                                                    <View style={styles.circularBox}>
                                                        <Icon name="phone-portrait" style={styles.actionButtonTitleIcon} />
                                                        <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>

                                                        </Text>
                                                    </View>

                                                    {/* <FontAwesomeIcon icon={faRectangleXmark} style={styles.actionButtonTitleIcon}/> */}

                                                    <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                        <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                            Enter New Mobile No.
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                            <View style={{ width: "70%" }}>
                                                                <TextInput
                                                                    onChangeText={(text) => this.setState({ setNewMobileNumber: text })}
                                                                    placeholder=""
                                                                />
                                                            </View>
                                                            {!this.state.otpSent ? (
                                                                <TouchableOpacity
                                                                    style={{
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 10,
                                                                        marginBottom: 15,
                                                                        marginLeft: 10,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        borderRadius: 4,
                                                                        backgroundColor: '#102D4F'
                                                                    }}
                                                                    onPress={this.handleSendOTP}
                                                                >
                                                                    {
                                                                        (this.state.sendOTPCalled) ?
                                                                            <ActivityIndicator size='small' color='white' /> :
                                                                            <Text style={{ justifyContent: 'center', color: 'white' }}>Send OTP</Text>
                                                                    }

                                                                </TouchableOpacity>
                                                            ) : (
                                                                <TouchableOpacity
                                                                    style={{
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 10,
                                                                        marginBottom: 15,
                                                                        marginLeft: 10,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        borderRadius: 4,
                                                                    }}
                                                                    onPress={this.handleSendOTP}
                                                                >
                                                                    {
                                                                        (this.state.sendOTPCalled) ?
                                                                            <ActivityIndicator size='small' color='white' /> :
                                                                            <Text style={{ justifyContent: 'center', color: '#102D4F' }}>Resend</Text>
                                                                    }

                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    </View>

                                                    {this.state.mobileVerified && (
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                    Verify Mobile OTP
                                                                </Text>
                                                                <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                // onPress={() =>
                                                                //     Toast.show({
                                                                //         type: ALERT_TYPE.WARNING,
                                                                //         title: 'Success',
                                                                //         textBody: 'Congrats! this is toast notification success',
                                                                //     })}
                                                                >
                                                                    <Icon name="help-circle-outline" style={styles.actionButtonIcon} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <OtpInputs
                                                                    handleChange={(code) => {
                                                                        this.setState({ motp: code });
                                                                    }}
                                                                    numberOfInputs={4}
                                                                    otp={true}
                                                                    inputContainerStyles={{
                                                                        ...styles.otpInputContainer
                                                                    }}
                                                                    inputStyles={{
                                                                        ...styles.otpInput
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {this.state.mobileVerified && (
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                    Verify Email OTP
                                                                </Text>
                                                                <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                // onPress={() =>
                                                                //     Toast.show({
                                                                //         type: ALERT_TYPE.SUCCESS,
                                                                //         title: 'Success',
                                                                //         textBody: 'Congrats! this is toast notification success',
                                                                //     })}
                                                                >
                                                                    <Icon name="help-circle-outline" style={styles.actionButtonIcon} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <OtpInputs
                                                                    handleChange={(code) => {
                                                                        this.setState({ eotp: code });
                                                                    }}
                                                                    numberOfInputs={4}
                                                                    otp={true}
                                                                    inputContainerStyles={{
                                                                        ...styles.otpInputContainer
                                                                    }}
                                                                    inputStyles={{
                                                                        ...styles.otpInput
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {this.state.errormsg && (
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'center', flexDirection: 'row', }}>
                                                            <Icon name="information-circle" style={styles.actionButtonIcon} />
                                                            <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                {this.state.errormsg}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    {this.state.mobileVerified && (
                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, marginBottom: 20 }}
                                                            onPress={() => {
                                                                this.handleVerifyUpdate();

                                                            }}
                                                        >
                                                            <Text style={styles.buttonLabelStyle}>
                                                                Verify & Update
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showEmailUpdateModal ?

                                    <LTSModal
                                        onClose={() => this.setState({ showEmailUpdateModal: false })}
                                        visible={this.state.showEmailUpdateModal}

                                        data={{


                                            uri: this.state.helpImageUrl,
                                            view:
                                                <View style={{ alignItems: 'center', marginTop: -40 }}>
                                                    <View style={styles.circularBox}>
                                                        <Icon name="mail" style={styles.actionButtonTitleIcon} />
                                                        <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>

                                                        </Text>
                                                    </View>

                                                    <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                        <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                            Enter New Email
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                            <View style={{ width: "70%" }}>
                                                                <TextInput
                                                                    onChangeText={(text) => this.setState({ setNewEmail: text })}
                                                                    placeholder=""
                                                                />
                                                            </View>
                                                            {!this.state.otpSent ? (
                                                                <TouchableOpacity
                                                                    style={{
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 10,
                                                                        marginBottom: 15,
                                                                        marginLeft: 10,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        borderRadius: 4,
                                                                        backgroundColor: '#102D4F'
                                                                    }}
                                                                    onPress={this.handleSendEOTP}
                                                                >
                                                                    {
                                                                        (this.state.sendOTPCalled) ?
                                                                            <ActivityIndicator size='small' color='white' /> :
                                                                            <Text style={{ justifyContent: 'center', color: 'white' }}>Send OTP</Text>
                                                                    }
                                                                </TouchableOpacity>
                                                            ) : (
                                                                <TouchableOpacity
                                                                    style={{
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 10,
                                                                        marginBottom: 15,
                                                                        marginLeft: 10,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        borderRadius: 4,
                                                                    }}
                                                                    onPress={this.handleSendEOTP}
                                                                >
                                                                    <Text style={{ justifyContent: 'center', color: '#102D4F' }}>Resend</Text>
                                                                </TouchableOpacity>
                                                            )}

                                                        </View>
                                                    </View>


                                                    {this.state.mobileVerified && (
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>

                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                    Verify Email OTP
                                                                </Text>

                                                                <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                // onPress={() =>
                                                                //     Toast.show({
                                                                //         type: ALERT_TYPE.INFO,
                                                                //         title: 'Success',
                                                                //         textBody: 'Congrats! this is toast notification success',
                                                                //     })}
                                                                >
                                                                    <Icon name="help-circle-outline" style={styles.actionButtonIcon} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <OtpInputs
                                                                    handleChange={(code) => {
                                                                        this.setState({ eotp: code });
                                                                    }}
                                                                    numberOfInputs={4}
                                                                    otp={true}
                                                                    inputContainerStyles={{
                                                                        ...styles.otpInputContainer
                                                                    }}
                                                                    inputStyles={{
                                                                        ...styles.otpInput
                                                                    }}
                                                                />

                                                                {/* <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4, backgroundColor: '#102D4F' }}
                                                                    onPress={() => {
                                                                        this.handleMobileOTPValidation()
                                                                    }}>

                                                                    <Text style={{ justifyContent: 'center', color: 'white' }}>Verify</Text>
                                                                </TouchableOpacity> */}
                                                            </View>

                                                        </View>
                                                    )}


                                                    {this.state.mobileVerified && (
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                    Verify Mobile OTP
                                                                </Text>

                                                                <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                // onPress={() =>
                                                                //     Toast.show({
                                                                //         type: ALERT_TYPE.SUCCESS,
                                                                //         title: 'Success',
                                                                //         textBody: 'Congrats! this is toast notification success',
                                                                //     })}
                                                                >
                                                                    <Icon name="help-circle-outline" style={styles.actionButtonIcon} />
                                                                </TouchableOpacity>


                                                            </View>


                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <OtpInputs
                                                                    handleChange={(code) => {
                                                                        this.setState({ motp: code });
                                                                    }}
                                                                    numberOfInputs={4}
                                                                    otp={true}
                                                                    inputContainerStyles={{
                                                                        ...styles.otpInputContainer
                                                                    }}
                                                                    inputStyles={{
                                                                        ...styles.otpInput
                                                                    }}
                                                                />

                                                                {/* <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4, backgroundColor: '#102D4F' }}
                                                                    onPress={() => {
                                                                        this.handleEmailOTPValidation()
                                                                    }}>

                                                                    <Text style={{ justifyContent: 'center', color: 'white' }}>Verify</Text>
                                                                </TouchableOpacity> */}
                                                            </View>

                                                        </View>
                                                    )}

                                                    {this.state.errormsg && (
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'center', flexDirection: 'row', }}>
                                                            <Icon name="information-circle" style={styles.actionButtonIcon} />
                                                            <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                {this.state.errormsg}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    {this.state.mobileVerified && (
                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, marginBottom: 20 }}
                                                            onPress={() => {
                                                                this.handleVerifyEUpdate();
                                                            }}
                                                        >
                                                            <Text style={styles.buttonLabelStyle}>
                                                                Verify & Update
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                </SafeAreaView>
            </AlertNotificationRoot>
        )
    }

}

export default withApiConnector(ProfileView, {
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
        getUserDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getMobileUserDetails',
            authenticate: true,
        },
        sendOTP: {
            type: 'post',
            moduleName: 'api',
            url: 'sendotp',
            authenticate: true,
        },
        verifyOTP: {
            type: 'post',
            moduleName: 'api',
            url: 'verifyotp',
            authenticate: true,
        },
    }
})



