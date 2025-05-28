import Mainstyles from '../../styles/globalStyles'
import styles from './ProfileViewStyles'

import React, { Component, useState } from 'react'
import { View, Text, Image, Button, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
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
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';
import { ArrowIcon, OTPIcon } from '../../../assets/icons';
import AppTextInput from '../../controls/AppTextInput';
import { launchImageLibrary } from 'react-native-image-picker';


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
            fullName: "",
            showToast: false,
            toastMessage: "",
            emiratesIdFront: null,
            emiratesIdBack: null,
            isModalVisible: false, setIsModalVisible: false,
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
            emailOtpEnabled: false,
            originalMobileNumber: '',
            originalEmail: '',

            editable: false,
            name: '',
            phone: '',
            email: '',
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
            if (!existingDetails.EMAIL || !mobileNumber) {
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
                MobileNumber: mobileNumber,
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
            if ( !mobileNumber) {
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
                EmailId: this.state.email,
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
                    const content = getUserDetailsResult.content;
                    console.log("User Details: ", content);
                    this.setState({
                        existingDetails: content,
                        mobileNumber: content.ID || '',
                        email: content.EMAIL || '',
                        originalMobileNumber: content.ID || '',
                        originalEmail: content.EMAIL || '',
                        name: content.PARTY_NAME || '',
                    });
                }
                else {

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

    toggleEdit = () => {
        this.setState({ editable: !this.state.editable });
    };

    getInitials = () => {
        const fullName = this.state.existingDetails?.PARTY_NAME || '';
        const nameParts = fullName.trim().split(/\s+/);

        if (nameParts.length >= 2) {
            // Use first and last word initials
            const first = nameParts[0].charAt(0).toUpperCase();
            const last = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
            return `${first}${last}`;
        } else if (nameParts.length === 1) {
            // Use first two letters of the single word
            return nameParts[0].substring(0, 2).toUpperCase();
        } else {
            return 'NA'; // fallback
        }
    };


    handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.8,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel || response.errorCode || !response.assets?.[0]) {
                console.warn('Image selection cancelled or failed');
                return;
            }

            const asset = response.assets[0];
            const base64Image = asset.base64;

            // ✅ Set the base64 image in state so UI updates
            this.setState((prev) => ({
                existingDetails: {
                    ...prev.existingDetails,
                    image: base64Image, // <-- this is what your render uses
                }
            }));

            // ✅ Upload image to backend
            try {
                const res = await this.props.updateProfileImage({
                    USER_ID: this.state.existingDetails.USER_ID,
                    IMAGE_BASE64: base64Image
                });

                if (res.STATUS === 'SUCCESS') {
                    console.log('Image uploaded successfully');
                } else {
                    console.warn('Image upload failed:', res.MSG);
                }
            } catch (err) {
                console.error('Image upload error:', err);
            }
        });
    };






    render() {

        return (
            <AlertNotificationRoot>
                <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >


                    <SafeAreaView style={{ height: "100%", flex: 1 }} >
                        {/* <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_20 : Dimensions.HP_10 }}>
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
                        <View style={{ ...Mainstyles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                        </View>
                    </View> */}

                        <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                            <View style={Mainstyles.headerLeft}>
                                <TouchableOpacity
                                    style={Mainstyles.backbutton}
                                    onPress={() => this.props.navigation.goBack()} >
                                    {/* <ArrowIcon direction={"left"} size={20} color="#FFFFFF" /> */}
                                    <ArrowIcon direction={"left"} size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                                <View style={Mainstyles.textContainer}>
                                    <View style={Mainstyles.nameRow}>
                                        <Text style={Mainstyles.welcomeLabel} >
                                            Edit Account
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                        <View style={Mainstyles.banner}>
                            <Text style={Mainstyles.bannerText}>
                                Need assistance? contact our support team, or access FAQs to get help quickly.
                            </Text>
                        </View>
                        <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}>
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

                                                <View style={styles.container}>
                                                    {/* Profile Image */}

                                                    <View style={styles.profileImageWrapper}>
                                                        {this.state.existingDetails.image ? (
                                                            <Image
                                                                source={{ uri: `data:image/jpeg;base64,${this.state.existingDetails.image}` }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) : (
                                                            <View style={[styles.profileImage, styles.initialsContainer]}>
                                                                <Text style={styles.initialsText}>
                                                                    {this.getInitials(
                                                                        this.state.existingDetails.firstName,
                                                                        this.state.existingDetails.lastName
                                                                    )}
                                                                </Text>
                                                            </View>
                                                        )}

                                                        {/* <TouchableOpacity style={styles.editIcon} onPress={this.handleImagePick}>
                                                            <Icon name="create" size={16} color="#fff" />
                                                        </TouchableOpacity> */}
                                                        <TouchableOpacity style={styles.editIcon} >
                                                            <Icon name="create" size={16} color="#fff" />
                                                        </TouchableOpacity>
                                                    </View>




                                                    {/* Full Name */}
                                                    <Text style={styles.label}>Full name</Text>
                                                    <View style={[styles.inputWrapper, { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10 }]}>
                                                        <Icon name="person-outline" size={20} style={[styles.icon, { color: '#aaa' }]} />

                                                        <AppTextInput
                                                            Value={this.state.existingDetails?.PARTY_NAME || ''}
                                                            OnChange={(text) => this.setState({ name: text })}
                                                            Type="normal"
                                                            Editable={false}
                                                            Style={{
                                                                color: '#888', // Muted text
                                                                fontSize: 15,
                                                                fontWeight: "900",
                                                                marginTop: 4,
                                                                backgroundColor: 'transparent' // Prevent conflict with outer View
                                                            }}
                                                        />
                                                    </View>


                                                    {/* Phone Number */}
                                                    <Text style={styles.label}>Phone number</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <Icon name="call-outline" size={20} style={styles.icon} />
                                                        {/* <TextInput
                                                            style={styles.input}
                                                            value={this.state.mobileNumber || ''}
                                                            editable={this.state.editable}
                                                            onChangeText={(text) => this.setState({ phone: text })}
                                                            keyboardType="phone-pad"
                                                        /> */}

                                                        <AppTextInput
                                                            Value={this.state.mobileNumber}
                                                            OnChange={(text) => this.setState({ mobileNumber: text })}
                                                            Type="numeric"
                                                            Editable={this.state.editable}
                                                            Style={{
                                                                color: 'black',
                                                                fontSize: 15,
                                                                fontWeight: "900",
                                                                marginTop: 4
                                                            }}
                                                        />

                                                    </View>

                                                    {/* Email Address */}
                                                    <Text style={styles.label}>Email address</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <Icon name="mail-outline" size={20} style={styles.icon} />
                                                        {/* <TextInput
                                                            style={styles.input}
                                                            value={this.state.existingDetails?.EMAIL || ''}
                                                            editable={this.state.editable}
                                                            onChangeText={(text) => this.setState({ email: text })}
                                                            keyboardType="email-address"
                                                        /> */}

                                                        <AppTextInput
                                                            Value={this.state.email}
                                                            OnChange={(text) => this.setState({ email: text })}
                                                            Type="email"
                                                            Editable={this.state.editable}
                                                            Style={{
                                                                color: 'black',
                                                                fontSize: 15,
                                                                fontWeight: "900",
                                                                marginTop: 0
                                                            }}
                                                        />

                                                    </View>

                                                    {/* Save Button */}
                                                    <TouchableOpacity
                                                        style={styles.saveButton}
                                                        onPress={() => {
                                                            const {
                                                                mobileNumber,
                                                                email,
                                                                originalMobileNumber,
                                                                originalEmail,
                                                                editable,
                                                            } = this.state;

                                                            // Only check for changes if in editable mode
                                                            if (editable) {
                                                                const mobileChanged = mobileNumber !== originalMobileNumber;
                                                                const emailChanged = email !== originalEmail;

                                                                // Nothing changed — show alert or do nothing
                                                                if (!mobileChanged && !emailChanged) {
                                                                    Alert.alert("Info", "You haven't changed mobile or email.");
                                                                    this.setState({ editable: false }); // Still turn off editable mode
                                                                    return;
                                                                }

                                                                // Only mobile changed
                                                                if (mobileChanged && !emailChanged) {
                                                                    this.setState({ setNewMobileNumber: mobileChanged });
                                                                    this.setState({ showUpdateModal: true, editable: false });
                                                                    this.handleSendOTP();
                                                                    return;
                                                                }

                                                                // Only email changed
                                                                if (!mobileChanged && emailChanged) {
                                                                    this.setState({ setNewEmail: emailChanged });
                                                                    this.setState({ showEmailUpdateModal: true, editable: false });
                                                                    this.handleSendEOTP();
                                                                    return;
                                                                }

                                                                // Both changed — open mobile first, then email after verification
                                                                if (mobileChanged && emailChanged) {
                                                                    Alert.alert("Info", "Please update either your email or mobile number, not both at once.");
                                                                    this.setState({ editable: false }); // Still turn off editable mode
                                                                    return;
                                                                    // this.setState({
                                                                    //     showUpdateModal: true,
                                                                    //     emailChangePending: true, // <- use this flag to trigger email modal after mobile verification
                                                                    //     editable: false,
                                                                    // });
                                                                    // return;
                                                                }
                                                            } else {
                                                                // Enter edit mode
                                                                this.setState({ editable: true });
                                                            }
                                                        }}
                                                    >
                                                        <Text style={styles.saveButtonText}>
                                                            {this.state.editable ? 'Save Changes' : 'Edit'}
                                                        </Text>
                                                    </TouchableOpacity>


                                                </View>

                                                {/* <TouchableOpacity style={{ ...styles.cardView, ...{ paddingHorizontal: 15, minHeight: 50, flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start', borderWidth: 0, borderRadius: 4 } }}>
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
                                                </TouchableOpacity> */}

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
                                                        source={this.state.readingResult == "EID updated successfully" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/readingFailure.png")}
                                                    // source={this.state.readingResult == "" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/readingFailure.png") }
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
                                                    <View style={{ alignItems: 'center', marginTop: -30 }}>

                                                        <OTPIcon />

                                                        {/* <FontAwesomeIcon icon={faRectangleXmark} style={styles.actionButtonTitleIcon}/> */}

                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>

                                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                <View style={{ width: "100%" }}>
                                                                    <Text style={{ ...styles.inputLabelHeadOTPStyle, textAlign: 'center' }}>
                                                                        Almost there!
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                <View style={{ width: "100%" }}>
                                                                    <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                        Check your messages on your phone and E-mail Inbox, then enter the verification code to save your edits
                                                                    </Text>
                                                                </View>

                                                            </View>
                                                        </View>

                                                        {this.state.mobileVerified && (
                                                            <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                        <View style={{ width: "100%" }}>
                                                                            <Text style={{ ...styles.inputLabelOTPStyle, textAlign: 'center' }}>
                                                                                Mobile Message OTP
                                                                            </Text>
                                                                        </View>
                                                                    </View>

                                                                    <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                    // onPress={() =>
                                                                    //     Toast.show({
                                                                    //         type: ALERT_TYPE.WARNING,
                                                                    //         title: 'Success',
                                                                    //         textBody: 'Congrats! this is toast notification success',
                                                                    //     })}
                                                                    >
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <OtpInputs
                                                                        handleChange={(code) => {
                                                                            this.setState({ motp: code });
                                                                        }}
                                                                        numberOfInputs={4}
                                                                        otp={true}
                                                                        inputContainerStyles={{ borderRadius: 4, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "#828E92", fontFamily: "Tajawal-Regular", fontSize: 10, textAlign: "right", height: 40, width: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', }}
                                                                        inputStyles={{ fontFamily: "Tajawal-Regular", fontSize: 28, borderRadius: 10, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "black", fontFamily: "Tajawal-Bold", fontSize: 20, height: 40, width: 40, textAlign: 'center', alignItems: "center", justifyContent: 'center', alignContent: 'center', textAlignVertical: "center", padding: 0 }}
                                                                    />
                                                                </View>
                                                            </View>
                                                        )}

                                                        {this.state.mobileVerified && (
                                                            <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                        <View style={{ width: "100%" }}>
                                                                            <Text style={{ ...styles.inputLabelOTPStyle, textAlign: 'center' }}>
                                                                                E-mail Inbox OTP
                                                                            </Text>
                                                                        </View>
                                                                    </View>

                                                                    <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                    // onPress={() =>
                                                                    //     Toast.show({
                                                                    //         type: ALERT_TYPE.SUCCESS,
                                                                    //         title: 'Success',
                                                                    //         textBody: 'Congrats! this is toast notification success',
                                                                    //     })}
                                                                    >
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <OtpInputs
                                                                        handleChange={(code) => {
                                                                            this.setState({ eotp: code });
                                                                        }}
                                                                        numberOfInputs={4}
                                                                        otp={true}
                                                                        inputContainerStyles={{ borderRadius: 4, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "#828E92", fontFamily: "Tajawal-Regular", fontSize: 10, textAlign: "right", height: 40, width: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', }}
                      inputStyles={{ fontFamily: "Tajawal-Regular", fontSize: 28, borderRadius: 10, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "black", fontFamily: "Tajawal-Bold", fontSize: 20, height: 40, width: 40, textAlign: 'center', alignItems: "center", justifyContent: 'center', alignContent: 'center', textAlignVertical: "center", padding: 0 }}
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
                                                                style={{ ...styles.buttonStyle }}
                                                                onPress={() => {
                                                                    this.handleVerifyUpdate();

                                                                }}
                                                            >
                                                                <Text style={styles.buttonLabelStyle}>
                                                                    Continue
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )}

                                                        {!this.state.otpSent ? (
                                                            <View style={styles.buttonViewR}>
                                                                <TouchableOpacity
                                                                    style={styles.buttonStyleR}
                                                                    onPress={this.handleSendOTP}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.buttonLabelStyleR,
                                                                            { color: "#102D4F" }
                                                                        ]}
                                                                    >
                                                                        Resend Code
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.buttonViewR}>
                                                                <TouchableOpacity
                                                                    style={styles.buttonStyleR}
                                                                    onPress={this.handleSendOTP}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.buttonLabelStyleR,
                                                                            { color: "#102D4F" }
                                                                        ]}
                                                                    >
                                                                        Resend Code
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
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
                                                    <View style={{ alignItems: 'center', marginTop: -30 }}>
                                                        
                                                        <OTPIcon />
                                                        <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>

                                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                <View style={{ width: "100%" }}>
                                                                    <Text style={{ ...styles.inputLabelHeadOTPStyle, textAlign: 'center' }}>
                                                                        Almost there!
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                <View style={{ width: "100%" }}>
                                                                    <Text style={{ ...styles.inputLabelStyle, textAlign: 'center' }}>
                                                                        Check your messages on your phone and E-mail Inbox, then enter the verification code to save your edits
                                                                    </Text>
                                                                </View>

                                                            </View>
                                                        </View>


                                                        {this.state.mobileVerified && (
                                                            <View style={{ ...styles.inputGroupStyle, alignItems: 'flex-start', marginBottom: 20 }}>

                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                     <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                        <View style={{ width: "100%" }}>
                                                                            <Text style={{ ...styles.inputLabelOTPStyle, textAlign: 'center' }}>
                                                                                E-mail Inbox OTP
                                                                            </Text>
                                                                        </View>
                                                                    </View>

                                                                    <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                    // onPress={() =>
                                                                    //     Toast.show({
                                                                    //         type: ALERT_TYPE.INFO,
                                                                    //         title: 'Success',
                                                                    //         textBody: 'Congrats! this is toast notification success',
                                                                    //     })}
                                                                    >
                                                                       
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <OtpInputs
                                                                        handleChange={(code) => {
                                                                            this.setState({ eotp: code });
                                                                        }}
                                                                        numberOfInputs={4}
                                                                        otp={true}
                                                                        inputContainerStyles={{ borderRadius: 4, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "#828E92", fontFamily: "Tajawal-Regular", fontSize: 10, textAlign: "right", height: 40, width: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', }}
                      inputStyles={{ fontFamily: "Tajawal-Regular", fontSize: 28, borderRadius: 10, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "black", fontFamily: "Tajawal-Bold", fontSize: 20, height: 40, width: 40, textAlign: 'center', alignItems: "center", justifyContent: 'center', alignContent: 'center', textAlignVertical: "center", padding: 0 }}
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
                                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                        <View style={{ width: "100%" }}>
                                                                            <Text style={{ ...styles.inputLabelOTPStyle, textAlign: 'center' }}>
                                                                                Mobile Message OTP
                                                                            </Text>
                                                                        </View>
                                                                    </View>

                                                                    <TouchableOpacity style={{ minHeight: 25, marginLeft: 10, flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderRadius: 4 }}
                                                                    // onPress={() =>
                                                                    //     Toast.show({
                                                                    //         type: ALERT_TYPE.SUCCESS,
                                                                    //         title: 'Success',
                                                                    //         textBody: 'Congrats! this is toast notification success',
                                                                    //     })}
                                                                    >
                                                                        
                                                                    </TouchableOpacity>


                                                                </View>


                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <OtpInputs
                                                                        handleChange={(code) => {
                                                                            this.setState({ motp: code });
                                                                        }}
                                                                        numberOfInputs={4}
                                                                        otp={true}
                                                                        inputContainerStyles={{ borderRadius: 4, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "#828E92", fontFamily: "Tajawal-Regular", fontSize: 10, textAlign: "right", height: 40, width: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', }}
                      inputStyles={{ fontFamily: "Tajawal-Regular", fontSize: 28, borderRadius: 10, borderWidth: 1, borderColor: "#0057A2", borderStyle: "solid", color: "black", fontFamily: "Tajawal-Bold", fontSize: 20, height: 40, width: 40, textAlign: 'center', alignItems: "center", justifyContent: 'center', alignContent: 'center', textAlignVertical: "center", padding: 0 }}
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
                                                                style={{ ...styles.buttonStyle }}
                                                                onPress={() => {
                                                                    this.handleVerifyEUpdate();
                                                                }}
                                                            >
                                                                <Text style={styles.buttonLabelStyle}>
                                                                    Continue
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )}
                                                        {!this.state.otpSent ? (
                                                            <View style={styles.buttonViewR}>
                                                                <TouchableOpacity
                                                                    style={styles.buttonStyleR}
                                                                    onPress={this.handleSendEOTP}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.buttonLabelStyleR,
                                                                            { color: "#102D4F" }
                                                                        ]}
                                                                    >
                                                                        Resend Code
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.buttonViewR}>
                                                                <TouchableOpacity
                                                                    style={styles.buttonStyleR}
                                                                    onPress={this.handleSendEOTP}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.buttonLabelStyleR,
                                                                            { color: "#102D4F" }
                                                                        ]}
                                                                    >
                                                                        Resend Code
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
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
                </LinearGradient>
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
        updateProfileImage: {
            type: 'post',
            moduleName: 'api',
            url: 'updateProfileImage',
            authenticate: true,
        },
    }
})



