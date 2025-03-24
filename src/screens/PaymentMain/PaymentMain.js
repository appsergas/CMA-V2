import Mainstyles from '../../styles/globalStyles'
import styles from './PaymentMainStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
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
import { ArrowLeftIcon, PaymentIcon, StatementIcon, MakePaymentIcon } from '../../../assets/icons'

import {
    paymentGatewayTokenApiUrl,
    paymentApiKeyTest,
    abudhabiTestOutletReference,
    abudhabiOutletReference,
    dubaiTestOutletReference,
    dubaiOutletReference,
    fujairahTestOutletReference,
    fujairahOutletReference,
    paymentGatewayCreateOrderUrl
} from '../../services/api/data/data/constants';
import axios from 'axios';
import {
    initiateCardPayment,
    initiateSamsungPay,
    initiateApplePay,
} from '@network-international/react-native-ngenius';
import Toast from '../../controls/Toast'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
// import MailCore from "react-native-mailcore";
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';

class PaymentMain extends Component {
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
            showToast: false,
            toastMessage: "",
            apiCallFlags: {
                updatePaymentApiCalled: false,
                getAllContractsCalled: false
            },
            updatePaymentReqBody: {},
            makePaymentClicked: false
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        let contracts = await AsyncStorage.getItem("contract_list")

        this.setState({ contractList: [...JSON.parse(contracts)] })
    }

    componentWillReceiveProps(nextProps) {
        const { updatePaymentResult } = nextProps
        if (this.state.apiCallFlags.updatePaymentApiCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: true, updatePaymentApiCalled: false, } },
                makePaymentClicked: false
            }, () => {
                if (updatePaymentResult && updatePaymentResult.content && (updatePaymentResult.content.MSG == "SUCESS")) {
                    // this.toastIt("Complaint posted sucessfully")
                    this.props.getAllContracts({
                        MobileNumber: this.props.contracts[this.state.activeItemIndex].MOBILE
                    })
                } else {
                    /**
                     * Alterative way to update payment in Serp DB
                     */
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

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
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

    carouselCurrentItem = (currentItemIndex) => {

        this.setState({ activeItemIndex: currentItemIndex })
    }

    formatDate = date => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    // makePayment = () => {
    //     let date = new Date()
    // }

    makePayment = async () => {
        this.setState({ makePaymentClicked: true }, async () => {

            let currentGasContract = this.props.contracts[this.state.activeItemIndex]
            if (await this.getPaymentGatewayAccessToken() != null) {
                let paidCardDetails = {
                    name: "MASTER",
                    cardType: "MAPP"
                }
                let token = await this.getPaymentGatewayAccessToken()
                let createOrderHeader = {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/vnd.ni-payment.v2+json',
                    'Accept': 'application/vnd.ni-payment.v2+json'
                };
                let createOrderReq = {
                    "action": "SALE",
                    "amount": {
                        "currencyCode": "AED",
                        "value": Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100)
                    },
                    "emailAddress": currentGasContract.EMAIL
                }

                let outLetReference = ""

                if (currentGasContract.COMPANY == "97") {
                    outLetReference = abudhabiTestOutletReference
                } else if (currentGasContract.COMPANY == "91") {
                    outLetReference = dubaiTestOutletReference
                } else if (currentGasContract.COMPANY == "92") {
                    outLetReference = fujairahTestOutletReference
                } else if (currentGasContract.COMPANY == "01") {
                    outLetReference = abudhabiOutletReference
                } else if (currentGasContract.COMPANY == "02") {
                    outLetReference = dubaiOutletReference
                } else if (currentGasContract.COMPANY == "03") {
                    outLetReference = fujairahOutletReference
                }

                axios.post(paymentGatewayCreateOrderUrl + outLetReference + "/orders", createOrderReq, { headers: createOrderHeader })
                    .then(async createOrderRes => {
                        if (createOrderRes.reference != undefined) {
                            try {
                                const initiateCardPaymentResponse = await initiateCardPayment(createOrderRes);
                                if (initiateCardPaymentResponse.status == "Success") {


                                    token = await this.getPaymentGatewayAccessToken()
                                    createOrderHeader.Authorization = 'Bearer ' + token
                                    await axios.get(paymentGatewayCreateOrderUrl + outLetReference + "/orders/" + createOrderRes.reference, { headers: createOrderHeader })
                                        .then(getOrderDetailsRes => {

                                            if (getOrderDetailsRes &&
                                                (getOrderDetailsRes._embedded.length != 0) &&
                                                getOrderDetailsRes._embedded.payment[0].paymentMethod &&
                                                getOrderDetailsRes._embedded.payment[0].paymentMethod.name) {

                                                paidCardDetails = getOrderDetailsRes._embedded.payment[0].paymentMethod

                                            } else {
                                                paidCardDetails = {
                                                    name: "MASTER",
                                                    cardType: "MAPP"
                                                }
                                            }

                                        })
                                        .catch(getOrderDetailsErr => {
                                            clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                        })


                                    this.toastIt("Payment Successful. It will be reflected in your account shortly.")
                                    let currentDate = new Date()
                                    let reqBody = {
                                        "COMPANY": currentGasContract.COMPANY,
                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                        "BUILDING_CODE": currentGasContract.BUILDING_CODE,
                                        "APARTMENT_CODE": currentGasContract.APARTMENT_CODE,
                                        "AMT": parseInt(currentGasContract.OUTSTANDING_AMT),
                                        "YEARCODE": currentDate.getFullYear(),
                                        "INV_DOCNO": currentGasContract.LAST_INVDOCNO,
                                        "INV_DOCTYPE": currentGasContract.LAST_INVDOCTYPE,
                                        "INV_YEARCODE": currentGasContract.LAST_YEARCODE,
                                        "CREDITCARD": paidCardDetails.name,
                                        "ONLINE_DOCDATE": this.formatDate(currentDate.toDateString()),
                                        "PAYMODE": paidCardDetails.cardType,
                                        "TRANSACTION_ID": createOrderRes.reference,
                                        "PROVIDER": "MAPP"
                                    }

                                    this.setState({
                                        apiCallFlags: { ...this.state.apiCallFlags, ...{ updatePaymentApiCalled: true } },
                                        updatePaymentReqBody: reqBody
                                    }, () => {
                                        this.props.updatePayment(reqBody)
                                    })
                                }
                            } catch (initiatePaymentErr) {
                                if (initiatePaymentErr.status == "Failed") {
                                    this.setState({ makePaymentClicked: false })
                                    this.toastIt("Payment Failed")
                                }
                                if (initiatePaymentErr.status == "Aborted") {
                                    this.setState({ makePaymentClicked: false })
                                    this.toastIt("Payment Aborted")
                                }
                            }
                        } else {
                            this.setState({ makePaymentClicked: false })
                            this.toastIt("Something went wrong. Try again later.")
                        }
                    })
                    .catch(createOrderErr => {
                        this.setState({ makePaymentClicked: false })
                        this.toastIt("Something went wrong. Try again later.")
                    })
            } else {
                this.setState({ makePaymentClicked: false })
                this.toastIt("Something went wrong. Try again later.")
            }
        })
    }

    handleEmail = () => {
        // MailCore.loginSmtp({
        //     hostname: "smtp.office365.com",
        //     port: 587,
        //     username: "noreply@sergas.com",
        //     password: "n@tinthemarsToday",
        //   })
        //     .then((result) => {

        //       MailCore.sendMail({
        //         headers: {
        //           key: "value",
        //         },
        //         from: {
        //           addressWithDisplayName: "from label",
        //           mailbox: "noreply@sergas.com",
        //         },
        //         to: {
        //           "aslam.sergas.com": "Aslam"
        //         },
        //         cc: {},
        //         bcc: {},
        //         subject: "Test subject",
        //         body: "Test body",
        //         attachments: [],
        //       })
        //         .then((result) => {
        //         })
        //         .catch((error) => {
        //         });
        //     })
        //     .catch((err) => {
        //     });
        // RNSmtpMailer.sendMail({
        //     mailhost: "smtp.office365.com",
        //     port: "587",
        //     ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
        //     username: "noreply@sergas.com",
        //     password: "n@tinthemarsToday",
        //     fromName: "Some Name", // optional
        //     // replyTo: "support@sergas.com", // optional
        //     recipients: "aslam@sergas.com",
        //     // bcc: ["bccEmail1", "bccEmail2"], // optional
        //     subject: "Test subject",
        //     htmlBody: "<h1>Test header</h1><p>body</p>",
        // attachmentPaths: [
        //   RNFS.ExternalDirectoryPath + "/image.jpg",
        //   RNFS.DocumentDirectoryPath + "/test.txt",
        //   RNFS.DocumentDirectoryPath + "/test2.csv",
        //   RNFS.DocumentDirectoryPath + "/pdfFile.pdf",
        //   RNFS.DocumentDirectoryPath + "/zipFile.zip",
        //   RNFS.DocumentDirectoryPath + "/image.png"
        // ], // optional
        // attachmentNames: [
        //   "image.jpg",
        //   "firstFile.txt",
        //   "secondFile.csv",
        //   "pdfFile.pdf",
        //   "zipExample.zip",
        //   "pngImage.png"
        // ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
        //   })
        //     .then(success => {})
        //     .catch(err => {});
    }

    getPaymentGatewayAccessToken = async () => {
        const reqBody = {};
        const headers = {
            'Authorization': 'Basic ' + paymentApiKeyTest,
            'Content-Type': 'application/vnd.ni-identity.v1+json'
        };
        let token = null
        await axios.post(paymentGatewayTokenApiUrl, reqBody, { headers })
            .then(res => {
                if ((res.access_token != undefined) || (res.access_token != null)) {
                    token = res.access_token
                }
            })
            .catch(err => {
                this.setState({ makePaymentClicked: false })
                this.toastIt("Something went wrong. Try again later.")
            })
        return token
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
            <ImageBackground
                source={require('../../assets/images/coverheader.png')}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="cover">
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    {/* header */}
                    <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                        <View style={Mainstyles.headerLeft}>
                            <TouchableOpacity
                                style={Mainstyles.backbutton}
                                onPress={() => this.props.navigation.goBack()} >
                                <ArrowLeftIcon />
                            </TouchableOpacity>
                            <View style={Mainstyles.textContainer}>
                                <View style={Mainstyles.nameRow}>
                                    <Text style={Mainstyles.welcomeLabel} >
                                        Payment
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Pay your gas bills quickly and securely with just a few taps.
                        </Text>
                    </View>
                    <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_2 : Dimensions.HP_2, }}>
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


                                <View style={Mainstyles.bodyview}>
                                    <TouchableOpacity style={Mainstyles.cardView}
                                        onPress={() => {
                                            if (this.props.contracts.length) {
                                                this.props.navigation.navigate("Payment")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >
                                        <View style={{...Mainstyles.optionIconViewCol1, backgroundColor: this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"}}>
                                        <MakePaymentIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"} fill={this.props.contracts.length ? "#0057A2" : "#A7A7A7"} />
                                        </View>
                                        <View style={Mainstyles.optionIconViewCol2}>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.notCustomerText}>
                                                    {t("home.makePayment")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.accountNumberText}> {
                                                    t("home.payYourself")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.payBillView}>
                                                <TouchableOpacity style={Mainstyles.payBillButton}
                                                    onPress={() => {
                                                        if (this.props.contracts.length) {
                                                            this.props.navigation.navigate("Payment")
                                                        } else {
                                                            this.toastIt("No Contract Available")
                                                        }
                                                    }}>
                                                    <Text style={[ Mainstyles.payBillText, { opacity: this.props.contracts.length ? 1 : 0.5 } ]}>
                                                        {t("home.payNow")}
                                                    </Text>

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={Mainstyles.cardView}
                                        onPress={() => {
                                            this.props.navigation.navigate("statement")
                                        }}
                                    >
                                        <View style={{...Mainstyles.optionIconViewCol1, backgroundColor: this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"}}>
                                        <StatementIcon width={50} height={50} color="#FFFFFF" fill={this.props.contracts.length ? "#0057A2" : "#A7A7A7"} />
                                        </View>
                                        <View style={Mainstyles.optionIconViewCol2}>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.notCustomerText}>
                                                    {t("pages.statement")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.accountNumberText}>
                                                    {t("payment.viewLast6MonthsBill")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.payBillView}>
                                                <TouchableOpacity style={Mainstyles.payBillButton}>
                                                    <Text style={[ Mainstyles.payBillText, { opacity: this.props.contracts.length ? 1 : 0.5 } ]}>
                                                        {t("home.checkNow")}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={Mainstyles.cardView}
                                        onPress={() => {
                                            if (this.props.contracts.length) {
                                                this.props.navigation.navigate("submitReading")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >
                                        <View style={{...Mainstyles.optionIconViewCol1, backgroundColor: this.props.contracts.length ? "#FFFFFF" : "#FFFFFF"}}>
                                        <PaymentIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#FFFFFF"} fill={this.props.contracts.length ? "#0057A2" : "#0057A2"} />
                                         </View>
                                        <View style={Mainstyles.optionIconViewCol2}>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.notCustomerText}>
                                                    {t("home.savedCards")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.accountNumberText}>{
                                                    t("home.manageCards")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.payBillView}>
                                                <TouchableOpacity style={Mainstyles.payBillButton}>
                                                    <Text style={[ Mainstyles.payBillText, { opacity: this.props.contracts.length ? 1 : 1 } ]}>
                                                        {t("home.requestNow")}
                                                    </Text>

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row', marginTop: 20 } }}
                                        onPress={() => {
                                            if (this.props.contracts.length) {
                                                this.props.navigation.navigate("Payment")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >

                                        <View style={styles.optionIconViewCol1}>
                                            <Image
                                                style={styles.icon}
                                                source={require('../../../assets/images/MakePaymentHome1.png')}
                                            />
                                        </View>
                                        <View style={styles.optionIconViewCol2}>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.notCustomerText}>{t("home.makePayment")}</Text>
                                            </View>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.accountNumberText}>{t("home.payYourself")}</Text>
                                            </View>
                                            <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                            >
                                                <Text style={styles.payBillText}>{t("home.payNow")}</Text>
                                                <Image
                                                    source={require('../../../assets/images/click.png')}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                        onPress={() => {
                                            if (this.props.contracts.length) {
                                                this.props.navigation.navigate("statement")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >
                                        <View style={styles.optionIconViewCol1}>
                                            <Image
                                                style={styles.icon}
                                                source={require('../../../assets/images/StatementHome1.png')}
                                            />
                                        </View>
                                        <View style={styles.optionIconViewCol2}>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.notCustomerText}>{t("pages.statement")}</Text>
                                            </View>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.accountNumberText}>{t("payment.viewLast6MonthsBill")}</Text>
                                            </View>
                                            <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                            >
                                                <Text style={styles.payBillText}>{t("home.checkNow")}</Text>
                                                <Image
                                                    source={require('../../../assets/images/click.png')}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity> */}

                                    {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                            onPress={() => { 
                                if (this.props.contracts.length) {
                                    
                                } else {
                                    this.toastIt("No Contract Available")
                                }
                             }}
                            >
                                <View style={styles.optionIconViewCol1}>
                                    <Image
                                        style={styles.icon}
                                        source={require('../../../assets/images/SavedCardsHome1.png')}
                                    />
                                </View>
                                <View style={styles.optionIconViewCol2}>
                                    <View style={styles.paymentDueRow1}>
                                        <Text style={styles.notCustomerText}>{t("home.savedCards")}</Text>
                                    </View>
                                    <View style={styles.paymentDueRow1}>
                                        <Text style={styles.accountNumberText}>{t("home.viewCrds")}</Text>
                                    </View>
                                    <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                    >
                                        <Text style={styles.payBillText}>{t("home.checkNow")}</Text>
                                        <Image
                                            source={require('../../../assets/images/click.png')}
                                            style={styles.clickImage}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity> */}


                                    {/* <TouchableOpacity
                        style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                        onPress={() => { this.props.navigation.navigate("HelpMain") }}
                    >
                        <View style={styles.optionIconViewCol1}>
                            <Image
                                style={styles.icon}
                                source={require('../../../assets/images/helpArticles.png')}
                            />
                        </View>
                        <View style={styles.optionIconViewCol2}>
                            <Text style={styles.accountNumberText}>{t("support.helpArticles")}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                        onPress={() => { Linking.openURL(`tel:600565657`) }}
                    >
                        <View style={styles.optionIconViewCol1}>
                            <Image
                                style={styles.icon}
                                source={require('../../../assets/images/callUs.png')}
                            />
                        </View>
                        <View style={styles.optionIconViewCol2}>
                            <Text style={styles.accountNumberText}>{t("support.callUs")}</Text>
                        </View>
                    </TouchableOpacity> */}

                                    {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }} >
                        <View style={styles.optionIconViewCol1}>
                            <Image
                                source={require('../../../assets/images/chatWithUs.png')}
                                style={styles.icon}
                            />
                        </View>
                        <View style={styles.optionIconViewCol2}>
                            <Text style={styles.accountNumberText}>{t("support.chatWithUs")}</Text>
                        </View>
                    </TouchableOpacity> */}

                                    {/* {
                        this.props.contracts.length ?
                            <>
                                <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                    onPress={() => this.props.navigation.navigate("raiseComplaint")}
                                >
                                    <View style={styles.optionIconViewCol1}>
                                        <Image
                                            source={require('../../../assets/images/complaint.png')}
                                            style={styles.icon}
                                        />
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <Text style={styles.accountNumberText}>Let Us Serve You</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                    onPress={() => this.props.navigation.navigate("feedback")}
                                >
                                    <View style={styles.optionIconViewCol1}>
                                        <Image
                                            source={require('../../../assets/images/feedback.png')}
                                            style={styles.icon}
                                        />
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <Text style={styles.accountNumberText}>{t("support.feedback")}</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                            :
                            null} */}

                                    {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                        onPress={() => this.props.navigation.navigate("AboutUs")}
                    >
                        <View style={styles.optionIconViewCol1}>
                            <Image
                                source={require('../../../assets/images/aboutUs.png')}
                                style={styles.icon}
                            />
                        </View>
                        <View style={styles.optionIconViewCol2}>
                            <Text style={styles.accountNumberText}>{t("support.aboutUs")}</Text>
                        </View>
                    </TouchableOpacity> */}

                                </View>
                            </ScrollView>
                            {this.state.showToast ? (
                                <Toast message={this.state.toastMessage} isImageShow={false} />
                            ) : null}
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                
                </SafeAreaView>
            </ImageBackground>

         
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(PaymentMain, {
    methods: {
        updatePayment: {
            type: 'post',
            moduleName: 'api',
            url: 'UpdatePayment',
            authenticate: true,
        },
        getAllContracts: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getContractsByMobile',
            authenticate: false,
        },
    }
}))



