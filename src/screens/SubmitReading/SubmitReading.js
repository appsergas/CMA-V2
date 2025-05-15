import Mainstyles from '../../styles/globalStyles'
import styles from './SubmitReadingStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import OtpInputs from 'react-native-otp-inputs';
import Modal from '../../controls/Modal'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { API_PATH } from '../../services/api/data/data/api-utils';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles'; 
import { ArrowIcon, CameraIcon } from '../../../assets/icons'

class SubmitReading extends Component {
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
            contractList: [],
            activeItemIndex: 0,
            newReading: 0,
            newReadingDecimalDigits: 0,
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                updateReadingApiCalled: false,
                updateReadingCorrectionApiCalled: false,
                getAllContractsCalled: false
            },
            image1: null,
            showModal: false,
            readingResult: "",
            checkDisconnectionRequestCalled: false,
            requestRaised: false,
            showEstimatedModal: false,
            showLowerActualReading: false
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount() {

        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({ contractList: this.props.contracts }, () => { })

    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { updateReadingResult, updateReadingCorrectionResult, getAllContractsResult, checkDisconnectionRequestResult } = nextProps
        if (this.state.apiCallFlags.updateReadingApiCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ updateReadingApiCalled: false } }
            })
            if (updateReadingResult && updateReadingResult.content && (updateReadingResult.content.MSG == "1|SUCESS")) {
                this.setState({
                    newReading: 0,
                    newReadingDecimalDigits: 0,
                    apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: true, updateReadingApiCalled: false } },
                    showModal: true,
                    readingResult: "Reading updated successfully"
                }, () => {

                    this.props.getAllContracts({
                        MobileNumber: this.props.contracts[this.state.activeItemIndex].MOBILE
                    })
                })

                // this.toastIt("Reading updated successfully", true)
            } else if (updateReadingResult && updateReadingResult.content && (updateReadingResult.content.MSG == "0|INVOICE NOT CREATED FOR LAST_READING")) {
                this.setState({
                    showModal: true,
                    readingResult: "Since Invoice is not created for the last reading, Could not update meter reading"
                })
                // this.toastIt("Since Invoice is not created for the last reading, Could not update meter reading ", false)
            } else if (updateReadingResult && updateReadingResult.content && (updateReadingResult.content.MSG == "0|CONTRACT NOT POSTED")) {
                this.setState({
                    showModal: true,
                    readingResult: "Since your account is under approval, could not update meter reading"
                })
                // this.toastIt("Since Invoice is not created for the last reading, Could not update meter reading ", false)
            } else {
                this.setState({
                    showModal: true,
                    readingResult: "Something went wrong, please try again later"
                })
                // this.toastIt("Something went wrong, please try again later", false)
            }
        }

        if (this.state.apiCallFlags.updateReadingCorrectionApiCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ updateReadingCorrectionApiCalled: false } }
            })
            if (updateReadingCorrectionResult && updateReadingCorrectionResult.content && (updateReadingCorrectionResult.content.MSG == "1|SUCESS")) {
                this.setState({
                    newReading: 0,
                    newReadingDecimalDigits: 0,
                    apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: true, updateReadingCorrectionApiCalled: false } },
                    showModal: true,
                    readingResult: "Reading updated successfully"
                }, () => {
                    this.props.getAllContracts({
                        MobileNumber: this.props.contracts[this.state.activeItemIndex].MOBILE
                    })
                })
                // this.toastIt("Reading updated successfully", true)
            } else if (updateReadingCorrectionResult && updateReadingCorrectionResult.content && (updateReadingCorrectionResult.content.MSG == "0|INVOICE NOT CREATED FOR LAST_READING")) {
                this.setState({
                    showModal: true,
                    readingResult: "Since Invoice is not created for the last reading, Could not update meter reading"
                })
                // this.toastIt("Since Invoice is not created for the last reading, Could not update meter reading ", false)
            } else if (updateReadingCorrectionResult && updateReadingCorrectionResult.content && (updateReadingCorrectionResult.content.MSG == "0|CONTRACT NOT POSTED")) {
                this.setState({
                    showModal: true,
                    readingResult: "Since your account is under approval, could not update meter reading"
                })
                // this.toastIt("Since Invoice is not created for the last reading, Could not update meter reading ", false)
            } else {
                this.setState({
                    showModal: true,
                    readingResult: "Something went wrong, please try again later"
                })
                // this.toastIt("Something went wrong, please try again later", false)
            }
        }

        if (this.state.checkDisconnectionRequestCalled) {

            this.setState({
                checkDisconnectionRequestCalled: false
            }, () => {
                if (checkDisconnectionRequestResult && checkDisconnectionRequestResult.content && (checkDisconnectionRequestResult.content.STATUS == "SUCCESS")) {
                    if (checkDisconnectionRequestResult.content.MSG != 'Request does not exist.') {
                        this.setState({
                            readingResult: "Meter reading cannot be updated once disconnection request raised for the account",
                            requestRaised: true
                        })
                    } else {
                        this.setState({
                            readingResult: "",
                            requestRaised: false
                        })
                    }
                    // this.setState({ requestRaised: checkDisconnectionRequestResult.content.MSG == 'Request does not exist.' ? false : true })
                }
            })
        }

        if (this.state.apiCallFlags.getAllContractsCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: false } }
            }, async () => {
                if (getAllContractsResult && getAllContractsResult.content && getAllContractsResult.content.STATUS == "SUCCESS") {

                    await AsyncStorage.setItem(
                        'contract_list',
                        JSON.stringify(getAllContractsResult.content.DETAIL)
                    )
                    this.props.updateContracts(getAllContractsResult.content.DETAIL)

                    //   setTimeout(() => {
                    //     this.forceUpdate();
                    //   }, 5000)
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

    handleSubmit = async () => {


        const { image1 } = this.state
        // this.props.navigation.navigate("Otp")
        if ((this.state.newReading == 0) || (((this.state.newReading / 1000).toString()) < this.props.contracts[this.state.activeItemIndex].LAST_READING) || (this.state.image1 == null)) {
            if (this.state.image1 == null) {
                this.toastIt("Please capture the meter", false)
            } else {
                this.toastIt("Current reading cannot be less than last reading or equal to zero", false)
            }
        } else {
            this.updateReading(false)
        }

    }

    updateReading = (correction) => {
        const { image1 } = this.state
        let attachments = []
        if (this.state.image1 != null) {
            let extension = image1.assets[0].fileName.replace(/^.*\./, '');
            attachments.push({ name: image1.assets[0].fileName, type: image1.assets[0].type, extension: extension, size: image1.assets[0].fileSize, value: image1.assets[0].base64 });
        }
        let currDate = new Date().toLocaleDateString('en-US');
        let reqBody = {
            "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
            "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
            "YEAR_CODE": new Date().getFullYear(),
            "DOC_DATE": currDate,
            "READING_DATE": currDate,
            "READING": (this.state.newReading / 1000).toString(),
            "LAST_READING": this.props.contracts[this.state.activeItemIndex].LAST_READING,
            "LAST_READING_DATE": this.props.contracts[this.state.activeItemIndex].LAST_READING_DATE,
            "USER_ID": this.props.contracts[this.state.activeItemIndex].USER_ID,
            "DEVICE_ID": "12345",
            "FILE_ATTACHMENTS": attachments,
            "CORRECTION": correction ? "true" : "false",
            "GAS_METER_NO": this.props.contracts[this.state.activeItemIndex].GAS_METER_NO,
            "LAST_ACTUAL_READING": this.props.contracts[this.state.activeItemIndex].LAST_ACTUAL_READING,
            "LAST_ACTUAL_READING_DATE": this.props.contracts[this.state.activeItemIndex].LAST_ACTUAL_READING_DATE,
        }
        if (correction) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ updateReadingCorrectionApiCalled: true } }
            }, () => {
                console.log("Correction", reqBody)
                this.props.updateReadingCorrection(reqBody)
            })
        } else {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ updateReadingApiCalled: true } }
            }, () => {
                console.log("Standard ", reqBody)
                this.props.updateReading(reqBody)
            })
        }
    }

    carouselCurrentItem = (currentItemIndex) => {
        this.setState({ activeItemIndex: currentItemIndex, checkDisconnectionRequestCalled: true }, () => {
            this.setState({ newReading: 0 })
            this.props.checkDisconnectionRequest({
                "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
                "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
                "BUILDING_CODE": this.props.contracts[this.state.activeItemIndex].BUILDING_CODE
            })
        })
    }

    toastIt = (message, back) => {
        this.setState({
            showToast: true,
            toastMessage: message,
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
            if (back) {
                this.props.navigation.goBack()
            }
        }, 5000);
    }



    render() {
        return (
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
               
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
                                        Meter Reading
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                        <View style={Mainstyles.banner}>
                            <Text style={Mainstyles.bannerText}>
                            Easily submit your gas meter readings to ensure accurate billing.
                            </Text>
                        </View>
                         <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
                          
                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_1 }}
                            style={{ flex: 1 }}
                            enabled
                            showsVerticalScrollIndicator={false}
                        >
                            <ScrollView
                                ref={(ref) => (this.scrollView = ref)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{...Mainstyles.containerView}}>


                                <View style={{ ...Mainstyles.accountsLabelView, marginTop: 20 }}>
                                    <Text style={Mainstyles.accountsLabel} >
                                        {t("home.selectAccount")}
                                    </Text>
                                </View>

                                <HomeMainCard
                                    contracts={this.props.contracts}
                                    from="raiseComplaint"
                                    usageCharges={1234}
                                    userName="User NameX"
                                    accountNumber="YYYY XXXX YYYY XXXX"
                                    currentIndex={this.carouselCurrentItem}
                                />

                                {
                                    this.state.checkDisconnectionRequestCalled ?
                                        <ActivityIndicator size={'small'} color={'#102D4F'} /> :
                                        <>
                                            <View style={Mainstyles.accountsLabelView}>
                                                <Text style={Mainstyles.accountsLabel} >
                                                    {t("home.enterMeterReading")}
                                                </Text>
                                            </View>

                                            {/* <Image style={{ width: "100%", height: 300, resizeMode: "stretch", marginBottom: 30, opacity: 0.06 }}
                                source={require("../../../assets/images/gasMeter.png")}
                            /> */}

                                            <View style={styles.inputGroupStyle}>
                                                {/* <TextInput
                                Value={this.state.newReading}
                                OnChange={(value) => {
                                    this.setState({ newReading: value })
                                }}
                            /> */}
                                                <View style={{ width: "95%", borderWidth: 2, borderColor: "#7CA8CF", paddingRight:10,paddingLeft:10, borderRadius: 14, padding: 2,  justifyContent: "center", }}>
                                                    <OtpInputs
                                                        // placeholder={this.props.contracts[this.state.activeItemIndex].LAST_READING.toString().split(".")[0]+this.props.contracts[this.state.activeItemIndex].LAST_READING.toString().split(".")[1]}
                                                        placeholder={this.state.newReading > 0 ? 0 : this.props.contracts[this.state.activeItemIndex].LAST_READING}
                                                        handleChange={(code) => {
                                                            this.setState({
                                                                newReading: code
                                                            })
                                                        }}
                                                        numberOfInputs={9}
                                                        autoFocus={true}
                                                        inputContainerStyles={{
                                                            // borderRadius: 4,
                                                            // borderWidth: 1,
                                                            // borderColor: "#E2E2E2",
                                                            // borderStyle: "solid",
                                                            // color: "#828E92",
                                                            // fontFamily: "Tajawal-Regular",
                                                            // fontSize: 10,
                                                            // textAlign: "right",
                                                            // height: 32,
                                                            // width: 32,
                                                            // justifyContent: 'center',
                                                            // alignItems: 'center',
                                                            // display: 'flex',
                                                        }}
                                                        inputStyles={{
                                                            fontFamily: "Tajawal-Regular",
                                                            fontSize: 20,
                                                            borderRadius: 8,
                                                            borderWidth: 1,
                                                            borderColor: "black",
                                                            borderStyle: "solid",
                                                            color: "black",
                                                            fontFamily: "Tajawal-Bold",
                                                            fontSize: 20,
                                                            // textAlign: "center",
                                                            height: 42,
                                                            width: 32,
                                                            textAlign: 'center',
                                                            alignItems: "center",
                                                            justifyContent: 'center',
                                                            alignContent: 'center',
                                                            textAlignVertical: "center",
                                                            // lineHeight: 32, 
                                                            padding: 0
                                                        }}
                                                    />
                                                </View>
                                                {/* <View style={{ width: "30%" }}>
                                <OtpInputs
                                    handleChange={(code) => {
                                        this.setState({
                                            newReading: parseInt(this.state.newReading) + parseFloat("0." + code),
                                            newReadingDecimalDigits: parseFloat("0." + code)
                                        })
                                    }
                                    }
                                    numberOfInputs={3}
                                    inputContainerStyles={{
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: "red",
                                        borderStyle: "solid",
                                        color: "black",
                                        fontFamily: "Tajawal-Regular",
                                        fontSize: 20,
                                        // textAlign: "left",
                                        height: 48,
                                        textAlign: 'center',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        display: "flex",
                                        alignContent: 'center'
                                    }}
                                    inputStyles={{
                                        color: "black",
                                        fontFamily: "Tajawal-Regular",
                                        fontSize: 20,
                                    }}
                                />
                            </View> */}
                                            </View>

                                            <View style={{ ...Mainstyles.accountsLabelView, marginTop: 20 }}>
                                                <Text style={Mainstyles.accountsLabel}>{t("home.attachMeterReading")}</Text>
                                            </View>
                                            <View style={{ ...styles.cardView, minHeight: 60, marginBottom: 40 }}>
                                                {/* <View style={styles.inputGroupStyle}>
                                <View>
                                    <Text style={styles.inputLabelStyle}>{t("support.complaintDescription")}</Text>
                                </View>
                                <View>
                                    <TextInput
                                        Style={{ height: 150 }}
                                    >

                                    </TextInput>
                                </View>
                            </View> */}

                                                <TouchableOpacity style={{ ...styles.paymentDueRow1, ...{ alignItems: 'center' } }}
                                                    onPress={() => launchCamera({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 },
                                                        (media) => {
                                                            if (!!media && media.assets) {
                                                                this.setState({ image1: media })
                                                            }
                                                        }
                                                    )}>

                                                    <View style={styles.addImageView}>
                                                        {/* <View style={styles.addImageViewCol}>
                                        <TouchableOpacity>
                                            <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                        </TouchableOpacity>
                                    </View> */}
                                                        {/* <View style={styles.addImageViewCol}>
                                        <TouchableOpacity>
                                            <Image style={styles.addImage} source={require("../../../assets/images/add.png")} />
                                        </TouchableOpacity>
                                    </View> */}
                                                        <View style={styles.addImageViewCol}>
                                                            <TouchableOpacity onPress={() => launchCamera({ mediaType: "image", maxHeight: 100, includeBase64: true, quality: 0.1 },
                                                                (media) => {
                                                                    if (!!media && media.assets) {
                                                                        this.setState({ image1: media })
                                                                    }
                                                                }
                                                            )}>
                                                                {/* {this.state.image1 != null ?
                                                                    <Image style={{ ...styles.addImage }} source={{ uri: this.state.image1.assets[0].uri }} />
                                                                    : <Image style={{ ...styles.addImage, resizeMode: "contain" }} source={require("../../../assets/images/camera2.png")} />
                                                                } */}
                                                                  <CameraIcon width={45} height={35} color="#102C4E" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ ...styles.addImageView, ...{ width: "75%" } }}>
                                                        {/* <Text style={styles.noteText}>{t("home.note")}</Text> */}
                                                        <Text style={styles.imageClearText}>
                                                            {/* {t("home.imageShouldBeClear")} */}
                                                            Image should be clearly visible.
                                                            </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity
                                                style={Mainstyles.buttonStyle}
                                                onPress={async () => {
                                                    console.log("this.state.newReading >>> ", this.state.newReading, " >>> ", this.state.newReading.toString().length, "\n", parseFloat(this.state.newReading / 1000))
                                                    if ((this.state.image1 == null) || ((parseFloat(this.state.newReading / 1000) == 0) || (this.state.newReading.toString().length != 9))) {
                                                        this.toastIt("Enter All Details / Please capture the meter", false)
                                                    } else {

                                                        if (this.state.requestRaised) {
                                                            this.setState({ showModal: true })
                                                        } else {

                                                            const contNo = this.props.contracts[this.state.activeItemIndex].CONTRACT_NO;
                                                            const comCode = this.props.contracts[this.state.activeItemIndex].COMPANY;
                                                            const response = await fetch(`${API_PATH}/api/GetMeterReading?contractNumber=${contNo}&company_code=${comCode}`);
                                                            const data = await response.json();
                                                            if (!data || data.VerifiedStatus === "REJECTED" || data.VerifiedStatus === "") {
                                                                if (this.props.contracts[this.state.activeItemIndex].ESTIMATED_READING == "Y") {


                                                                    if (this.props.contracts[this.state.activeItemIndex].LAST_ACTUAL_READING &&
                                                                        (this.props.contracts[this.state.activeItemIndex].LAST_ACTUAL_READING != "") &&
                                                                        (parseFloat(this.state.newReading / 1000) < parseFloat(this.props.contracts[this.state.activeItemIndex].LAST_ACTUAL_READING))) {
                                                                        this.setState({
                                                                            showLowerActualReading: true
                                                                        })
                                                                    } else if ((parseFloat(this.state.newReading / 1000) < parseFloat(this.props.contracts[this.state.activeItemIndex].LAST_READING))) {
                                                                        this.setState({
                                                                            showEstimatedModal: true
                                                                        })
                                                                    } else {
                                                                        this.updateReading(false)
                                                                    }
                                                                } else {
                                                                    if (parseFloat(this.state.newReading / 1000) <= parseFloat(this.props.contracts[this.state.activeItemIndex].LAST_READING)) {
                                                                        this.toastIt("Current reading cannot be less than last reading or equal to zero", false)
                                                                    } else {
                                                                        this.updateReading(false)
                                                                    }
                                                                }
                                                            } else if (data.VerifiedStatus === "VERIFIED") {
                                                                this.toastIt("you have already submitted and verified your reading.", false)
                                                            }
                                                            else if (data.VerifiedStatus === "NOT_VERIFIED") {
                                                                this.toastIt(`Your reading was submitted on ${data.RequestedOn} and is currently under review.`, false);
                                                            }

                                                        }

                                                    }
                                                }}
                                            >
                                                {
                                                    this.state.apiCallFlags.updateReadingApiCalled ?
                                                        <ActivityIndicator size={"small"} color={"white"} /> :
                                                        <Text
                                                            style={Mainstyles.buttonLabelStyle}>{t("support.submit")}</Text>
                                                }
                                            </TouchableOpacity>
                                        </>
                                }

                            </ScrollView>

                            {
                                this.state.showModal ?
                                    <Modal
                                        close={false}
                                        onClose={() => this.setState({ showModal: false })}
                                        visible={this.state.showModal}
                                        data={{
                                            uri: this.state.helpImageUrl,
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={this.state.readingResult == "Reading updated successfully" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>{this.state.readingResult == "Reading updated successfully" ? "Thank You" : "Meter Reading"} </Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>{this.state.readingResult == "Reading updated successfully" ? this.state.readingResult + ". Your invoice wil be processed within the next 72 hours." : this.state.readingResult}</Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        })
                                                        this.state.readingResult == "Something went wrong, please try again later" ? null : this.props.navigation.goBack()
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>{this.state.readingResult == "Something went wrong, please try again later" ? "Try Again" : "Done"}</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showEstimatedModal ?
                                    <Modal
                                        close={false}
                                        onClose={() => this.setState({ showEstimatedModal: false })}
                                        visible={this.state.showEstimatedModal}
                                        button1={true}
                                        button2={true}
                                        onButton1={() => {
                                            this.setState({ showEstimatedModal: false })
                                        }}
                                        onButton2={() => {
                                            this.setState({
                                                showEstimatedModal: false
                                            }, () => {
                                                this.updateReading(true)
                                            })
                                        }}
                                        data={{
                                            title: "Are you sure?",
                                            // message: "Test",
                                            button1Text: "No",
                                            button2Text: "Yes",
                                            uri: this.state.helpImageUrl,
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>The current value you entered is less than your last estimated reading. Are you sure to update {(this.state.newReading / 1000).toString()} as your actual reading?</Text>
                                                </View>
                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showLowerActualReading ?
                                    <Modal
                                        close={true}
                                        onClose={() => this.setState({ showLowerActualReading: false })}
                                        visible={this.state.showLowerActualReading}
                                        data={{
                                            title: "Could not update lower value",
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>The reading you entered "{(this.state.newReading / 1000).toString()}" is less than your last actual reading "{this.props.contracts[this.state.activeItemIndex].LAST_ACTUAL_READING}". Please enter higher value.</Text>
                                                </View>
                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                    {/* </InfoContainer> */}
                    {this.state.showToast ? (
                        <Toast message={this.state.toastMessage} isImageShow={false} />
                    ) : null}
                </SafeAreaView>
            </LinearGradient>
        )
    }

}

const mapStateToProps = ({ contractsReducer }) => {
    return {
        contracts: contractsReducer.contracts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateContracts: (data) => dispatch(updateContracts(data))
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(SubmitReading, {
    methods: {
        updateReading: {
            type: 'post',
            moduleName: 'api',
            url: 'updateReading',
            authenticate: true,
        },
        updateReadingCorrection: {
            type: 'post',
            moduleName: 'api',
            url: 'updateReadingCorrection',
            authenticate: true,
        },
        getAllContracts: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getContractsByMobile',
            authenticate: false,
        },
        checkDisconnectionRequest: {
            type: 'post',
            moduleName: 'api',
            url: 'checkDisconnectionRequest',
            authenticate: true,
        },
    }
}))



