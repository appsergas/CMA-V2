import Mainstyles from '../../styles/globalStyles'
import styles from './DisconnectionRequestStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
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
import DatePicker from 'react-native-date-picker'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import Toast from '../../controls/Toast'
import Modal from '../../controls/Modal'
import {
    paymentGatewayTokenApiUrl,
    abudhabiTestOutletReference,
    abudhabiOutletReference,
    dubaiTestOutletReference,
    dubaiOutletReference,
    fujairahTestOutletReference,
    fujairahOutletReference,
    paymentGatewayCreateOrderUrl,
    paymentGatewayTokenApiUrlTest,
    paymentGatewayCreateOrderUrlTest,
    paymentApiKeyTest,
    paymentApiKeyAUH,
    paymentApiKeyDXB,
    paymentApiKeyALN,
    alainOutletReference
} from '../../services/api/data/data/constants';
import axios from 'axios';
import {
    initiateCardPayment,
    initiateSamsungPay,
    initiateApplePay,
    isApplePaySupported,
    isSamsungPaySupported,

} from '@network-international/react-native-ngenius';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { API_PATH } from '../../services/api/data/data/api-utils';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles'; 
import { ArrowIcon, CircleRadioIcon } from '../../../assets/icons'

class DisconnectionRequest extends Component {
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
            date: new Date(new Date().getTime() + (1 * 86400000)),
            apiCallFlags: {
                requestDisconnectionApiCalled: false,
                updatePaymentApiCalled: false,
                createCollectionInvoiceCalled: false,
                getAllContractsCalled: false
            },
            showToast: false,
            toastMessage: "",
            showPaidModal: false,
            makePaymentClicked: false,
            updatePaymentReqBody: {},
            createCollectionReqBody: {},
            paidDisconnection: false,
            showModal: false,
            readingResult: "",
            checkDisconnectionRequestCalled: false,
            requestRaised: false,
            restrictDisconnection: false,
            restrictDisconnectionModal: false,
            applePaySupported: false,
            samsungPaySupported: false,
            payMode: ""
        }

        this.PaymentVisible()
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({ contractList: [...JSON.parse(contracts)] })

        if (Platform.OS == 'ios') {
            this.setState({
                applePaySupported: await isApplePaySupported(),
            })
        } else {
            this.setState({
                samsungPaySupported: await isSamsungPaySupported()
            })
        }
    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillReceiveProps(nextProps) {
        const { requestDisconnectionResult, updatePaymentResult, createCollectionInvoiceResult, checkDisconnectionRequestResult } = nextProps
        if (this.state.apiCallFlags.requestDisconnectionApiCalled && requestDisconnectionResult && requestDisconnectionResult.content) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ requestDisconnectionApiCalled: false } }
            }, () => {
                if (requestDisconnectionResult && requestDisconnectionResult.content && /^[0-9]*$/.test(requestDisconnectionResult.content.MSG)) {
                    if (this.state.paidDisconnection) {
                        this.setState({
                            apiCallFlags: { ...this.state.apiCallFlags, createCollectionInvoiceCalled: true }
                        }, () => {
                            this.props.createCollectionInvoice(this.state.createCollectionReqBody)
                        })
                    } else {
                        this.toastIt("Request successful for Disconnection", true)
                    }
                } else if (requestDisconnectionResult && requestDisconnectionResult.content && (requestDisconnectionResult.content.MSG == "Request submitted already, Could not request again.")) {
                    this.toastIt(requestDisconnectionResult.content.MSG, false)
                } else {
                    this.toastIt("Technical error. Try again later.", false)
                }
            })
        }

        if (this.state.checkDisconnectionRequestCalled) {
            this.setState({
                checkDisconnectionRequestCalled: false
            }, () => {
                if (checkDisconnectionRequestResult && checkDisconnectionRequestResult.content && (checkDisconnectionRequestResult.content.STATUS == "SUCCESS")) {
                    this.setState({
                        restrictDisconnection: checkDisconnectionRequestResult.content.ERRORCODE == 'True' ? true : false
                    })
                    if (checkDisconnectionRequestResult.content.MSG != 'Request does not exist.') {
                        this.setState({
                            readingResult: "Request submitted already, Could not request again.",
                            requestRaised: true,
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

        if (this.state.apiCallFlags.updatePaymentApiCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ updatePaymentApiCalled: false, } },
                makePaymentClicked: false
            }, () => {
                if (updatePaymentResult && updatePaymentResult.content && (updatePaymentResult.content.MSG == "SUCESS")) {
                    this.toastIt("Request successful for Disconnection", true)
                } else {
                    this.toastIt("Request successful for Disconnection", true)
                }
            })
        }

        if (this.state.apiCallFlags.createCollectionInvoiceCalled && createCollectionInvoiceResult && createCollectionInvoiceResult.content) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ createCollectionInvoiceCalled: false, } },
                makePaymentClicked: false
            }, () => {
                if (createCollectionInvoiceResult && createCollectionInvoiceResult.content && (createCollectionInvoiceResult.content.STATUS == "1|SUCESS")) {
                    // this.toastIt("Complaint posted sucessfully",false)
                    // this.props.getAllContracts({
                    //     MobileNumber: this.props.contracts[this.state.activeItemIndex].MOBILE
                    // })
                    this.setState({
                        apiCallFlags: { ...this.state.apiCallFlags, ...{ updatePaymentApiCalled: true, createCollectionInvoiceCalled: false, } }
                    })
                    this.props.updatePayment({
                        ...this.state.updatePaymentReqBody, ...{
                            "INV_NO": createCollectionInvoiceResult.content.MSG,
                            "INV_DOC_TYPE": "GINC",
                            "INV_YEARCODE": new Date().getFullYear()
                        }
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

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }

    async PaymentVisible() {
        try {
            let currentGasContract = this.props.contracts[this.state.activeItemIndex]
            const response = await fetch(API_PATH + '/api/PayMode');
            const data = await response.json();

            let cardPayVisible = false;
            let applePayVisible = false;
            let samsungPayVisible = false;

            for (const paymentType of data) {
                if (paymentType.PayType === 'NetworkPay' && paymentType.Is_Active) {
                    cardPayVisible = true;
                }
                if (paymentType.PayType === 'ApplePay' && paymentType.Is_Active && Platform.OS === 'ios') {
                    applePayVisible = true;
                }

                if (paymentType.PayType === 'SamsungPay' && paymentType.Is_Active && Platform.OS === 'android') {
                    try {
                        const manufacturer = await DeviceInfo.getManufacturer();

                        if (manufacturer === 'samsung') {
                            samsungPayVisible = true;
                        }
                    } catch (error) {

                    }
                }
            }


            this.setState({
                cardPaySupported: cardPayVisible,
                applePaySupported: applePayVisible,
                samsungPaySupported: samsungPayVisible
            });

        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
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

    handleSubmit = () => {
        let reqBody = {
            "USER_ID": this.props.contracts[this.state.activeItemIndex].USER_ID,
            "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
            "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
            "DATE": new Date(new Date().getTime()),
            "BUILDING_CODE": this.props.contracts[this.state.activeItemIndex].BUILDING_CODE,
            "APARTMENT_CODE": this.props.contracts[this.state.activeItemIndex].APARTMENT_CODE,
            "PREFERRED_DATE_TIME": "",
            "PARTY_NAME": this.props.contracts[this.state.activeItemIndex].PARTYNAME,
            "EID": this.props.contracts[this.state.activeItemIndex].EID
        }
        this.setState({
            showPaidModal: false,
            apiCallFlags: { ...this.state.apiCallFlags, ...{ requestDisconnectionApiCalled: true } }
        }, () => this.props.requestDisconnection(reqBody))
    }

    carouselCurrentItem = (currentItemIndex) => {

        this.setState({ activeItemIndex: currentItemIndex, checkDisconnectionRequestCalled: true }, () => {
            this.props.checkDisconnectionRequest({
                "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
                "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
                "BUILDING_CODE": this.props.contracts[this.state.activeItemIndex].BUILDING_CODE
            })
        })
    }

    toastIt = (message, back) => {
        this.setState({
            showModal: true,
            readingResult: message,
        });
        // setTimeout(() => {
        //     this.setState({ showToast: false, toastMessage: "" });
        //     if (back) {
        //         this.props.navigation.goBack()
        //     }
        // }, 5000);
    }

    getTraceId = async () => {
        var pattern = "xxxx-yxxx-4xxx-xxxxxxxxxxxx"
        var date = new Date().getTime();

        var uuid = pattern.replace(/[xy]/g, function (c) {
            var r = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid.toString()
    }

    makePayment = async (type) => {
        this.setState({ makePaymentClicked: true }, async () => {

            let outLetReference = "", apiKey = "", tokenApiUrl = "", orderApiUrl = ""
            let currentGasContract = this.props.contracts[this.state.activeItemIndex]
            if (currentGasContract.COMPANY == "97") {
                outLetReference = abudhabiTestOutletReference
                apiKey = paymentApiKeyTest
                tokenApiUrl = paymentGatewayTokenApiUrlTest
                orderApiUrl = paymentGatewayCreateOrderUrlTest
            } else if (currentGasContract.COMPANY == "91") {
                outLetReference = dubaiTestOutletReference
                apiKey = paymentApiKeyTest
                tokenApiUrl = paymentGatewayTokenApiUrlTest
                orderApiUrl = paymentGatewayCreateOrderUrlTest
            } else if (currentGasContract.COMPANY == "92") {
                outLetReference = fujairahTestOutletReference
                apiKey = paymentApiKeyTest
                tokenApiUrl = paymentGatewayTokenApiUrlTest
                orderApiUrl = paymentGatewayCreateOrderUrlTest
            } else if (currentGasContract.COMPANY == "01") {
                outLetReference = abudhabiOutletReference
                apiKey = paymentApiKeyAUH
                tokenApiUrl = paymentGatewayTokenApiUrl
                orderApiUrl = paymentGatewayCreateOrderUrl
            } else if (currentGasContract.COMPANY == "02") {
                outLetReference = dubaiOutletReference
                apiKey = paymentApiKeyDXB
                tokenApiUrl = paymentGatewayTokenApiUrl
                orderApiUrl = paymentGatewayCreateOrderUrl
            } else if (currentGasContract.COMPANY == "03") {
                outLetReference = fujairahOutletReference
                apiKey = paymentApiKeyTest
                tokenApiUrl = paymentGatewayTokenApiUrl
                orderApiUrl = paymentGatewayCreateOrderUrl
            } else if (currentGasContract.COMPANY == "05") {
                outLetReference = alainOutletReference
                apiKey = paymentApiKeyALN
                tokenApiUrl = paymentGatewayTokenApiUrl
                orderApiUrl = paymentGatewayCreateOrderUrl
            }

            let currDate = new Date().toLocaleDateString('en-US');
            let currentDate = new Date()

            if (await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl) != null) {
                let paidCardDetails = {
                    name: "MASTER",
                    cardType: "DEBIT"
                }
                let token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
                let createOrderHeader = {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/vnd.ni-payment.v2+json',
                    'Accept': 'application/vnd.ni-payment.v2+json'
                };
                let createOrderReq = {
                    "action": "SALE",
                    "amount": {
                        "currencyCode": "AED",
                        "value": 10500
                    },
                    "emailAddress": (currentGasContract.EMAIL != "") && (currentGasContract.EMAIL != null) ? currentGasContract.EMAIL : "accounts@sergas.com",
                    "merchantDefinedData": {
                        "ContractId": currentGasContract.CONTRACT_NO + " for Preferred DISCONNECTION",
                        "CustomerName": currentGasContract.PARTY_NAME
                    },
                    "MerchantOrderReference": `${(await this.getTraceId()).replace(/-/g, '').substring(0, 7).toUpperCase()}-MP`
                }

                axios.post(orderApiUrl + outLetReference + "/orders", createOrderReq, { headers: createOrderHeader })
                    .then(async createOrderRes => {
                        if (createOrderRes.reference != undefined) {

                            if ((type == "applepay") || (type == "samsungpay")) {
                                try {
                                    const payResponse = type == "samsungpay" ?
                                        await initiateSamsungPay(createOrderRes,
                                            currentGasContract.COMPANY == "01" ? 'SERGAS Customer AUH' :
                                                currentGasContract.COMPANY == "02" ? 'SERGAS Customer DXB' :
                                                    currentGasContract.COMPANY == "05" ? 'SERGAS Customer ALN' :
                                                        'SERGAS Customer',
                                            currentGasContract.COMPANY == "01" ? '7b41f6ef17874fc3bf4ccb' :
                                                currentGasContract.COMPANY == "02" ? '44f457d4b8da4a8bbe2dfe' :
                                                    currentGasContract.COMPANY == "05" ? 'c084781e34924bf7b13927' :
                                                        'aa1080513289421082caa1') :
                                        type == "applepay" ? await initiateApplePay(createOrderRes, {
                                            merchantIdentifier: currentGasContract.COMPANY == "01" ? 'merchant.sergas.sergascustomerauh' : currentGasContract.COMPANY == "02" ? 'merchant.sergas.sergascustomerdxb' : currentGasContract.COMPANY == "05" ? 'merchant.sergas.sergascustomeralain' : 'merchant.sergas.sergascustomer', // Merchant ID created in Apple's portal
                                            countryCode: 'AE', // Country code of the order
                                            merchantName: currentGasContract.COMPANY == "01" ? 'SERGAS Customer AUH' : currentGasContract.COMPANY == "02" ? 'SERGAS Customer DXB' : currentGasContract.COMPANY == "05" ? 'SERGAS Customer ALN' : 'SERGAS Customer', // name of the merchant to be shown in Apple Pay button
                                        }) : null;
                                    if (payResponse.status == "Success") {

                                        token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
                                        createOrderHeader.Authorization = 'Bearer ' + token
                                        await axios.get(orderApiUrl + outLetReference + "/orders/" + createOrderRes.reference, { headers: createOrderHeader })
                                            .then(getOrderDetailsRes => {

                                                if (getOrderDetailsRes &&
                                                    (getOrderDetailsRes._embedded.length != 0) &&
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod && getOrderDetailsRes._embedded.payment[0].state == "CAPTURED" &&
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod.name) {
                                                    if (type == "samsungpay") {
                                                        paidCardDetails = {
                                                            name: "SAMSUNG_PAY",
                                                            cardType: "DEBIT"
                                                        }
                                                    }
                                                    else {
                                                        paidCardDetails = getOrderDetailsRes._embedded.payment[0].paymentMethod
                                                    }
                                                    let disconnectionReqBody = {
                                                        "USER_ID": this.props.contracts[this.state.activeItemIndex].USER_ID,
                                                        "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
                                                        "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
                                                        "DATE": new Date(new Date().getTime()),
                                                        "PAYMENT_STATUS": "PAID",
                                                        "PAYMENT_TXN_ID": createOrderRes.reference,
                                                        "BUILDING_CODE": this.props.contracts[this.state.activeItemIndex].BUILDING_CODE,
                                                        "APARTMENT_CODE": this.props.contracts[this.state.activeItemIndex].APARTMENT_CODE,
                                                        "PREFERRED_DATE_TIME": this.state.date,
                                                        "PARTY_NAME": this.props.contracts[this.state.activeItemIndex].PARTYNAME,
                                                        "EID": this.props.contracts[this.state.activeItemIndex].EID
                                                    }

                                                    let updatePaymentReqBody = {
                                                        "COMPANY": currentGasContract.COMPANY,
                                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                                        "YEARCODE": currentDate.getFullYear(),
                                                        "REC_DOC_TYPE": "GREC",
                                                        "INV_NO": currentGasContract.LAST_INVDOCNO,
                                                        "INV_DOC_TYPE": "GINC",
                                                        "INV_DATE": this.formatDate(currentDate.toDateString()),
                                                        "INV_YEAR_CODE": currentDate.getFullYear(),
                                                        "INV_AMT": "105",
                                                        "REC_AMT": "105",
                                                        "DATE": currDate,
                                                        "USER_ID": currentGasContract.USER_ID,
                                                        "DEVICE_ID": "12345"
                                                    }


                                                    let reqBody = {
                                                        "COMPANY": currentGasContract.COMPANY,
                                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                                        "DEVICE_ID": "12345",
                                                        "DATE": currDate,
                                                        "AMOUNT": "100",
                                                        "REMARKS": "URGENT DISCONNECTION - MOBILE APP",
                                                        "USER_ID": currentGasContract.USER_ID,
                                                        "YEAR_CODE": currentDate.getFullYear(),
                                                        "CHARGE_TYPE": "UDF",
                                                        "CHARGE_DESCP": "URGENT DISCONNECTION FEE",
                                                        "YEARCODE": currentDate.getFullYear()
                                                    }

                                                    this.setState({
                                                        // apiCallFlags: { ...this.state.apiCallFlags, ...{ createCollectionInvoiceCalled: true } },
                                                        updatePaymentReqBody: updatePaymentReqBody,
                                                        createCollectionReqBody: reqBody,
                                                        paidDisconnection: true
                                                    }, () => {
                                                        // this.props.createCollectionInvoice(reqBody)
                                                    })
                                                    this.setState({
                                                        apiCallFlags: { ...this.state.apiCallFlags, ...{ requestDisconnectionApiCalled: true } }
                                                    }, () => {
                                                        this.props.requestDisconnection(disconnectionReqBody)
                                                    })
                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": 105,
                                                        "ReceivedAmount": 105,
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "SUCCESS",
                                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                                        "Company": currentGasContract.COMPANY,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentType": "DISCONNECTION"
                                                    })
                                                } else {
                                                    this.setState({ makePaymentClicked: false })
                                                    this.toastIt("Payment Failed", false)

                                                    const paidCardDetails =
                                                        type === "samsungpay"
                                                            ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                                            : type === "applepay"
                                                                ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                                : { name: "", cardType: "" };

                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": 105,
                                                        "ReceivedAmount": 105,
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "FAILED",
                                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                                        "Company": currentGasContract.COMPANY,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentType": "DISCONNECTION"
                                                    })
                                                }

                                            })
                                            .catch(getOrderDetailsErr => {
                                                clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                            })



                                    } else {
                                        const paidCardDetails =
                                            type === "samsungpay"
                                                ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                                : type === "applepay"
                                                    ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                    : { name: "", cardType: "" };

                                        this.props.updatePaymentLog({
                                            "OrderId": createOrderRes.reference,
                                            "TotalAmount": 105,
                                            "ReceivedAmount": 105,
                                            "OnlineDocDate": new Date(),
                                            "Status": "FAILED",
                                            "ContractNo": currentGasContract.CONTRACT_NO,
                                            "Company": currentGasContract.COMPANY,
                                            "TransactionId": createOrderRes.reference,
                                            "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                            "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                            "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                            "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentType": "DISCONNECTION"
                                        })
                                    }

                                } catch (err) {
                                    this.setState({ makePaymentClicked: false })
                                    this.toastIt("Payment Failed", false)

                                    const paidCardDetails =
                                        type === "samsungpay"
                                            ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                            : type === "applepay"
                                                ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                : { name: "", cardType: "" };

                                    this.props.updatePaymentLog({
                                        "OrderId": createOrderRes.reference,
                                        "TotalAmount": 105,
                                        "ReceivedAmount": 105,
                                        "OnlineDocDate": new Date(),
                                        "Status": "FAILED",
                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                        "Company": currentGasContract.COMPANY,
                                        "TransactionId": createOrderRes.reference,
                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentType": "DISCONNECTION"
                                    })
                                }
                            } else {
                                try {
                                    const initiateCardPaymentResponse = await initiateCardPayment(createOrderRes);
                                    if (initiateCardPaymentResponse.status == "Success") {


                                        token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
                                        createOrderHeader.Authorization = 'Bearer ' + token
                                        await axios.get(orderApiUrl + outLetReference + "/orders/" + createOrderRes.reference, { headers: createOrderHeader })
                                            .then(getOrderDetailsRes => {

                                                if (getOrderDetailsRes &&
                                                    (getOrderDetailsRes._embedded.length != 0) &&
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod && getOrderDetailsRes._embedded.payment[0].state == "CAPTURED" &&
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod.name) {

                                                    paidCardDetails = getOrderDetailsRes._embedded.payment[0].paymentMethod
                                                    let disconnectionReqBody = {
                                                        "USER_ID": this.props.contracts[this.state.activeItemIndex].USER_ID,
                                                        "CONTRACT_NO": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
                                                        "COMPANY": this.props.contracts[this.state.activeItemIndex].COMPANY,
                                                        "DATE": new Date(new Date().getTime()),
                                                        "PAYMENT_STATUS": "PAID",
                                                        "PAYMENT_TXN_ID": createOrderRes.reference,
                                                        "BUILDING_CODE": this.props.contracts[this.state.activeItemIndex].BUILDING_CODE,
                                                        "APARTMENT_CODE": this.props.contracts[this.state.activeItemIndex].APARTMENT_CODE,
                                                        "PREFERRED_DATE_TIME": this.state.date,
                                                        "PARTY_NAME": this.props.contracts[this.state.activeItemIndex].PARTYNAME,
                                                        "EID": this.props.contracts[this.state.activeItemIndex].EID
                                                    }

                                                    let updatePaymentReqBody = {
                                                        "COMPANY": currentGasContract.COMPANY,
                                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                                        "YEARCODE": currentDate.getFullYear(),
                                                        "REC_DOC_TYPE": "GREC",
                                                        "INV_NO": currentGasContract.LAST_INVDOCNO,
                                                        "INV_DOC_TYPE": "GINC",
                                                        "INV_DATE": this.formatDate(currentDate.toDateString()),
                                                        "INV_YEAR_CODE": currentDate.getFullYear(),
                                                        "INV_AMT": "105",
                                                        "REC_AMT": "105",
                                                        "DATE": currDate,
                                                        "USER_ID": currentGasContract.USER_ID,
                                                        "DEVICE_ID": "12345"
                                                    }


                                                    let reqBody = {
                                                        "COMPANY": currentGasContract.COMPANY,
                                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                                        "DEVICE_ID": "12345",
                                                        "DATE": currDate,
                                                        "AMOUNT": "100",
                                                        "REMARKS": "URGENT DISCONNECTION - MOBILE APP",
                                                        "USER_ID": currentGasContract.USER_ID,
                                                        "YEAR_CODE": currentDate.getFullYear(),
                                                        "CHARGE_TYPE": "UDF",
                                                        "CHARGE_DESCP": "URGENT DISCONNECTION FEE",
                                                        "YEARCODE": currentDate.getFullYear()
                                                    }

                                                    this.setState({
                                                        // apiCallFlags: { ...this.state.apiCallFlags, ...{ createCollectionInvoiceCalled: true } },
                                                        updatePaymentReqBody: updatePaymentReqBody,
                                                        createCollectionReqBody: reqBody,
                                                        paidDisconnection: true
                                                    }, () => {
                                                        // this.props.createCollectionInvoice(reqBody)
                                                    })
                                                    this.setState({
                                                        apiCallFlags: { ...this.state.apiCallFlags, ...{ requestDisconnectionApiCalled: true } }
                                                    }, () => {
                                                        this.props.requestDisconnection(disconnectionReqBody)
                                                    })
                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": 105,
                                                        "ReceivedAmount": 105,
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "SUCCESS",
                                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                                        "Company": currentGasContract.COMPANY,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentType": "DISCONNECTION"
                                                    })
                                                } else {
                                                    if (initiatePaymentErr.status == "Failed") {
                                                        this.setState({ makePaymentClicked: false })
                                                        this.toastIt("Payment Failed", false)
                                                    }
                                                    if (initiatePaymentErr.status == "Aborted") {
                                                        this.setState({ makePaymentClicked: false })
                                                        this.toastIt("Payment Aborted", false)
                                                    }
                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": 105,
                                                        "ReceivedAmount": 105,
                                                        "OnlineDocDate": new Date(),
                                                        "Status": initiatePaymentErr.status,
                                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                                        "Company": currentGasContract.COMPANY,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentType": "DISCONNECTION"
                                                    })
                                                }

                                            })
                                            .catch(getOrderDetailsErr => {
                                                clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                            })



                                    } else {
                                        this.props.updatePaymentLog({
                                            "OrderId": createOrderRes.reference,
                                            "TotalAmount": 105,
                                            "ReceivedAmount": 105,
                                            "OnlineDocDate": new Date(),
                                            "Status": "FAILED",
                                            "ContractNo": currentGasContract.CONTRACT_NO,
                                            "Company": currentGasContract.COMPANY,
                                            "TransactionId": createOrderRes.reference,
                                            "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                            "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                            "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                            "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentType": "DISCONNECTION"
                                        })
                                    }
                                } catch (initiatePaymentErr) {
                                    if (initiatePaymentErr.status == "Failed") {
                                        this.setState({ makePaymentClicked: false })
                                        this.toastIt("Payment Failed", false)
                                    }
                                    if (initiatePaymentErr.status == "Aborted") {
                                        this.setState({ makePaymentClicked: false })
                                        this.toastIt("Payment Aborted", false)
                                    }
                                    this.props.updatePaymentLog({
                                        "OrderId": createOrderRes.reference,
                                        "TotalAmount": 105,
                                        "ReceivedAmount": 105,
                                        "OnlineDocDate": new Date(),
                                        "Status": initiatePaymentErr.status,
                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                        "Company": currentGasContract.COMPANY,
                                        "TransactionId": createOrderRes.reference,
                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO,
                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentType": "DISCONNECTION"
                                    })
                                }
                            }
                        } else {
                            this.setState({ makePaymentClicked: false })
                            this.toastIt("Something went wrong. Try again later.", false)
                        }
                    })
                    .catch(createOrderErr => {
                        this.setState({ makePaymentClicked: false })
                        this.toastIt("Something went wrong. Try again later.", false)
                    })
            } else {
                this.setState({ makePaymentClicked: false })
                this.toastIt("Something went wrong. Try again later.", false)
            }
        })
    }

    getPaymentGatewayAccessToken = async (apiKey, tokenApiUrl) => {
        const reqBody = {};
        const headers = {
            'Authorization': 'Basic ' + apiKey,
            'Content-Type': 'application/vnd.ni-identity.v1+json'
        };
        let token = null
        await axios.post(tokenApiUrl, reqBody, { headers })
            .then(res => {
                if ((res.access_token != undefined) || (res.access_token != null)) {
                    token = res.access_token
                }
            })
            .catch(err => {
                this.setState({ makePaymentClicked: false })
                this.toastIt("Something went wrong. Try again later.", false)
            })
        return token
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
                                        Disconnection Request
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Request to disconnect your gas service quickly.
                        </Text>
                    </View>
                     <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>
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
                                contentContainerStyle={Mainstyles.containerView}>


                                <View style={{ ...Mainstyles.accountsLabelView, marginTop: 30 }}>
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
                                        <ActivityIndicator size={'small'} color={"#102D4F"} /> :
                                        <>
                                            <View style={{ ...Mainstyles.accountsLabelView }}>
                                                <Text style={Mainstyles.accountsLabel} >
                                                    Preferred Date For Disconnection
                                                </Text>
                                            </View>

                                            <TouchableOpacity onPress={() => { this.setState({ paidDisconnection: true }) }} style={{ ...styles.headerView, marginBottom: 0, minHeight: 40 }}>
                                                <View style={{ flexDirection: "row", }}>
                                                    <View style={Mainstyles.headerCol1}>
                                                        <TouchableOpacity
                                                            // style={this.state.paidDisconnection ? { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1, backgroundColor: "#102D4F" } : { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 0.4 }}
                                                            onPress={() => { this.setState({ paidDisconnection: true }) }}>
                                                            <CircleRadioIcon width={24} height={24} fill={this.state.paidDisconnection ? '#0057A2' : '#D3D3D3'} />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => { this.setState({ paidDisconnection: true }) }} style={{ marginLeft: 10 }}>
                                                            <Text style={{...Mainstyles.preferrenceHeader, color:this.state.paidDisconnection ? '#102C4E' : '#102C4EB3'}} >
                                                                Immediate Disconnection
                                                            </Text>
                                                            <Text style={{ ...Mainstyles.preferrenceLabel}} >
                                                                Additional charges apply for Immediate Disconnection + Associated Fees : 105 AED
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.setState({ paidDisconnection: false }) }} style={{ ...Mainstyles.headerSubView, marginTop: 10, marginBottom: 20 }}>
                                                <View style={{ flexDirection: "row", }}>
                                                    <View style={Mainstyles.headerCol1}>
                                                        <TouchableOpacity
                                                            // style={this.state.paidDisconnection ? { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1 } : { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1, backgroundColor: "#102D4F" }}
                                                            onPress={() => { this.setState({ paidDisconnection: false }) }}>
                                                            <CircleRadioIcon width={24} height={24} fill={this.state.paidDisconnection ? '#D3D3D3' : '#0057A2'} />
                                                        </TouchableOpacity>
                                                        {/* D3D3D3 */}
                                                        <Text style={{ ...Mainstyles.preferrenceHeader, color:this.state.paidDisconnection ? '#102C4EB3' : '#102C4E', marginLeft: 10 }} >
                                                            Regular Disconnection
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>


                                            <TouchableOpacity
                                                style={Mainstyles.buttonStyle}
                                                // onPress={this.handleSubmit}
                                                onPress={() => {
                                                    if (this.state.restrictDisconnection) {
                                                        this.setState({
                                                            restrictDisconnectionModal: true
                                                        })
                                                    } else if (this.state.requestRaised) {
                                                        this.setState({
                                                            showModal: true
                                                        })
                                                    } else {
                                                        if (this.state.paidDisconnection) {
                                                            this.setState({ showPaidModal: true })
                                                        } else {
                                                            this.handleSubmit()
                                                        }
                                                    }
                                                }}
                                            >
                                                {
                                                    (this.state.apiCallFlags.requestDisconnectionApiCalled || this.state.apiCallFlags.updatePaymentApiCalled || this.state.makePaymentClicked) ?
                                                        <ActivityIndicator size='small' color='white' /> :
                                                        <Text
                                                            style={Mainstyles.buttonLabelStyle}>{t("home.submit")}</Text>
                                                }
                                            </TouchableOpacity>
                                        </>
                                }


                            </ScrollView>
                            {this.state.showToast ? (
                                <Toast message={this.state.toastMessage} isImageShow={false} />
                            ) : null}
                            {
                                this.state.showModal ?
                                    <Modal
                                        close={false}
                                        onClose={() => this.setState({ showModal: false })}
                                        visible={this.state.showModal}
                                        data={{
                                            // title: "Immediate Disconnection",
                                            // message: "Test",
                                            button1Text: "Close",
                                            button2Text: "Pay",
                                            uri: this.state.helpImageUrl,
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={this.state.readingResult == "Request successful for Disconnection" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>{this.state.readingResult == "Request successful for Disconnection" ? "Thank You" : "Technical Error"} </Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={styles.accountNumberText}>{this.state.readingResult}</Text>
                                                </View>


                                                <TouchableOpacity
                                                    style={{ ...Mainstyles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        }, () => {
                                                            (this.state.readingResult == "Request successful for Disconnection") ? this.props.navigation.goBack() : null
                                                        })

                                                    }}
                                                >
                                                    <Text
                                                        style={Mainstyles.buttonLabelStyle}>{(this.state.readingResult == "Request successful for Disconnection") || (this.state.readingResult == "Request submitted already, Could not request again.") ? "Done" : "Try Again"}</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.showPaidModal ?
                                    <Modal
                                        onClose={() => this.setState({ showPaidModal: false })}
                                        visible={this.state.showPaidModal}
                                        data={{
                                            // title: "Immediate Disconnection",
                                            // message: "Test",
                                            uri: this.state.helpImageUrl,
                                            view: <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                                                {/* <View style={{ ...styles.cardView, marginBottom: 0 }}> */}
                                                {/* <View style={styles.inputGroupStyle}> */}
                                                <View>
                                                    <Text style={styles.inputLabelStyle}>{t("myLinks.preferredDateAndTime")}</Text>
                                                </View>
                                                <View>
                                                    <DatePicker
                                                        mode="date"
                                                        minimumDate={new Date().getHours() > 10 ? new Date(new Date().getTime() + (1 * 86400000)) : new Date()}
                                                        minuteInterval={30}
                                                        date={this.state.date}
                                                        onDateChange={(date) => {
                                                            this.setState({
                                                                date: date
                                                            })
                                                        }}
                                                    />
                                                </View>



                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "80%", marginBottom: 20, marginTop: 5 }}
                                                    onPress={() => {
                                                        this.setState({ showPaidModal: false })
                                                        this.makePayment("")
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>Pay 105 AED now</Text>
                                                </TouchableOpacity>

                                                {
                                                    this.state.applePaySupported || this.state.samsungPaySupported ?

                                                        <TouchableOpacity
                                                            style={{ ...styles.buttonStyle, width: "80%" }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    showPaidModal: false,
                                                                    payMode: this.state.applePaySupported ? "applepay" : "samsungpay"
                                                                })
                                                                this.makePayment(this.state.applePaySupported ? "applepay" : "samsungpay")
                                                            }}
                                                        >
                                                            {
                                                                this.state.applePaySupported ? <Image source={require("../../../assets/images/Apple_Pay.png")} style={{ height: 25, resizeMode: "contain" }} /> :
                                                                    <Image source={require("../../../assets/images/Samsung_Pay.png")} style={{ height: 30, resizeMode: "contain" }} />
                                                            }
                                                        </TouchableOpacity>
                                                        : null
                                                }

                                            </View>
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                    /> :
                                    null
                            }
                            {
                                this.state.restrictDisconnectionModal ?
                                    <Modal
                                        onClose={() => {
                                            this.setState({ restrictDisconnectionModal: false })
                                        }}
                                        visible={this.state.restrictDisconnectionModal}
                                        data={{
                                            view: <View style={{ alignItems: 'center', width: "100%" }}>
                                                <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                    source={require("../../../assets/images/readingSuccess.png")}
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>Almost there</Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={{ ...styles.accountNumberText, fontSize: 14, lineHeight: 20 }}>You are our special customer 😀. Let us assist you at your doorstep 🧑‍🔧.</Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "100%" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            restrictDisconnectionModal: false
                                                        })
                                                        Linking.openURL(`tel:600565657`)
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.buttonLabelStyle}>Call us</Text>
                                                </TouchableOpacity>

                                                {/* </View> */}

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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(DisconnectionRequest, {
    methods: {
        requestDisconnection: {
            type: 'post',
            moduleName: 'api',
            url: 'requestDisconnection',
            authenticate: true,
        },
        createCollectionInvoice: {
            type: 'post',
            moduleName: 'api',
            url: 'createCollectionInvoice',
            authenticate: true,
        },
        getAllContracts: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getContractsByMobile',
            authenticate: false,
        },
        updatePayment: {
            type: 'post',
            moduleName: 'api',
            url: 'createInvoiceReceipt',
            authenticate: true,
        },
        updatePaymentLog: {
            type: 'post',
            moduleName: 'api',
            url: 'PaymentLog',
            authenticate: true,
        },
        checkDisconnectionRequest: {
            type: 'post',
            moduleName: 'api',
            url: 'checkDisconnectionRequest',
            authenticate: true,
        },
    }
})
)