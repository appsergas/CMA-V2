
import styles from './PaymentStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, TextInput } from 'react-native'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import TextInput from '../../controls/TextInput'
import HomeMainCard from '../../components/HomeMainCard';
import {
    paymentGatewayTokenApiUrl,
    paymentGatewayTokenApiUrlTest,
    paymentApiKeyTest,
    abudhabiTestOutletReference,
    abudhabiOutletReference,
    dubaiTestOutletReference,
    dubaiOutletReference,
    fujairahTestOutletReference,
    fujairahOutletReference,
    paymentGatewayCreateOrderUrl,
    paymentGatewayCreateOrderUrlTest,
    paymentApiKeyAUH,
    paymentApiKeyDXB,
    alainOutletReference,
    paymentApiKeyALN
} from '../../services/api/data/data/constants';
import axios from 'axios';
import {
    initiateCardPayment,
    initiateSamsungPay,
    initiateApplePay,
    isApplePaySupported,
    isSamsungPaySupported,

} from '@network-international/react-native-ngenius';
import Toast from '../../controls/Toast'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import Modal from '../../controls/Modal'
// import MailCore from "react-native-mailcore";
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { API_PATH } from '../../services/api/data/data/api-utils';
import DeviceInfo from 'react-native-device-info';

class Payment extends Component {
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
                getAllContractsCalled: false,
                getLatestInvoiceCalled: false
            },
            updatePaymentReqBody: {},
            makePaymentClicked: false,
            showModal: false,
            readingResult: "",
            cardPaySupported: false,
            applePaySupported: false,
            samsungPaySupported: false,
            payMode: "",
            payOtherAmount: false,
            otherAmt: '',
            currentInvoice: '',
            currInvDocType: '',
            currInvYearCode: ''
        }
        this.PaymentVisible()
        this.scrollView = React.createRef()
        this.otherAmtRef = React.createRef()
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
                        console.error("Error fetching manufacturer:", error);
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

    async componentWillMount() {
        let contracts = await AsyncStorage.getItem("contract_list")
        if (Platform.OS == 'ios') {
            this.setState({
                applePaySupported: await isApplePaySupported(),
            })
        } else {
            this.setState({
                samsungPaySupported: await isSamsungPaySupported()
            })
        }
        this.setState({ contractList: [...JSON.parse(contracts)] })
    }

    componentWillReceiveProps(nextProps) {
        const { updatePaymentResult, getAllContractsResult, getLatestInvoiceResult } = nextProps
        if (this.state.apiCallFlags.updatePaymentApiCalled && updatePaymentResult && updatePaymentResult.content) {
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

        if (this.state.apiCallFlags.getLatestInvoiceCalled && getLatestInvoiceResult && getLatestInvoiceResult.content) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getLatestInvoiceCalled: false } }
            }, () => {
                if (getLatestInvoiceResult && getLatestInvoiceResult.content && getLatestInvoiceResult.content.INV_NO != null) {
                    this.setState({
                        currentInvoice: getLatestInvoiceResult.content.INV_NO,
                        currInvDocType: getLatestInvoiceResult.content.INV_DOC_TYPE,
                        currInvYearCode: getLatestInvoiceResult.content.INV_YEAR_CODE
                    })
                }
            })
        }
    }

    async componentDidMount() {
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

        this.setState({ 
            activeItemIndex: currentItemIndex, 
            currentInvoice: '',
            apiCallFlags: { ...this.state.apiCallFlags,getLatestInvoiceCalled: true }},
            () => {
                this.props.getLatestInvoice({
                    "contract": this.props.contracts[this.state.activeItemIndex].CONTRACT_NO,
                    "company": this.props.contracts[this.state.activeItemIndex].COMPANY
                })
            }
        )

    }

    getTraceId = async () => {
        var pattern =  "xxxx-yxxx-4xxx-xxxxxxxxxxxx"
        var date = new Date().getTime();
        
        var uuid = pattern.replace(/[xy]/g, function(c) {
            var r = (date + Math.random()*16)%16 | 0;
            date = Math.floor(date/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid.toString()  
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

    makePayment = async (type) => {
        let currentGasContract = this.props.contracts[this.state.activeItemIndex]
        if ((currentGasContract.LAST_INVDOCNO == "") && (this.state.currentInvoice == "") ) {
            this.toastIt("Invoice not available. Please contact customer care.")
        } else {
        let outLetReference = "", apiKey = "", tokenApiUrl = "", orderApiUrl = ""
        
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

        this.setState({ makePaymentClicked: true }, async () => {
            let token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
            if (token != null) {
                let paidCardDetails = {
                    name: "MASTER",
                    cardType: "DEBIT"
                }
                let createOrderHeader = {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/vnd.ni-payment.v2+json',
                    'Accept': 'application/vnd.ni-payment.v2+json'
                };
                let createOrderReq = {
                    "action": "SALE",
                    "amount": {
                        "currencyCode": "AED",
                        // "value": 1200
                        "value": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) * 100 : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100)
                    },
                    "emailAddress": (currentGasContract.EMAIL != "") && (currentGasContract.EMAIL != null) ? currentGasContract.EMAIL : "accounts@sergas.com",
                    "merchantDefinedData": {
                        "ContractId": currentGasContract.CONTRACT_NO,
                        "CustomerName": currentGasContract.PARTY_NAME
                    },
                    "MerchantOrderReference": `${(await this.getTraceId()).replace(/-/g,'').substring(0, 7).toUpperCase()}-MP`
                }



                axios.post(orderApiUrl + outLetReference + "/orders", createOrderReq, { headers: createOrderHeader })
                    .then(async createOrderRes => {
                        if (createOrderRes.reference != undefined) {
                            let currentDate = new Date()
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
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod && getOrderDetailsRes._embedded.payment[0].state=="CAPTURED" &&
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

                                                    this.toastIt("Payment Successful. It will be reflected in your account shortly.")
                                                    let reqBody = {
                                                        "COMPANY": currentGasContract.COMPANY,
                                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                                        "BUILDING_CODE": currentGasContract.BUILDING_CODE,
                                                        "APARTMENT_CODE": currentGasContract.APARTMENT_CODE,
                                                        "AMT": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                        "YEARCODE": currentDate.getFullYear(),
                                                        "INV_DOCNO": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                                        "INV_DOCTYPE": currentGasContract.LAST_INVDOCTYPE != "" ? currentGasContract.LAST_INVDOCTYPE : this.state.currInvDocType,
                                                        "INV_YEARCODE": currentGasContract.LAST_YEARCODE != "" ? currentGasContract.LAST_YEARCODE : this.state.currInvYearCode,
                                                        "CREDITCARD": paidCardDetails.name,
                                                        "ONLINE_DOCDATE": this.formatDate(currentDate.toDateString()),
                                                        "PAYMODE": paidCardDetails.name,
                                                        "TRANSACTION_ID": createOrderRes.reference,
                                                        "PROVIDER": "MAPP"
                                                    }

                                                    this.setState({
                                                        apiCallFlags: { ...this.state.apiCallFlags, ...{ updatePaymentApiCalled: true } },
                                                        updatePaymentReqBody: reqBody
                                                    }, () => {
                                                        this.props.updatePayment(reqBody)
                                                        this.props.updatePaymentLog({
                                                            "OrderId": createOrderRes.reference,
                                                            "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                            "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                            "OnlineDocDate": new Date(),
                                                            "Status": "SUCCESS",
                                                            "ContractNo": currentGasContract.CONTRACT_NO,
                                                            "Company": currentGasContract.COMPANY,
                                                            "TransactionId": createOrderRes.reference,
                                                            "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                                            "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE != "" ? currentGasContract.LAST_INVDOCTYPE : this.state.currInvDocType,
                                                            "InvoiceYearCode": currentGasContract.LAST_YEARCODE != "" ? currentGasContract.LAST_YEARCODE : this.state.currInvYearCode,
                                                            "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                            "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                            "PaymentType": "INVOICE_PAYMENT"
                                                        })
                                                    })

                                                } else {
                                                    console.log('status ', getOrderDetailsRes)
                                                    this.setState({ makePaymentClicked: false })
                                                    this.toastIt("Payment Failed please try another method")
                                                    const paidCardDetails =
                                                        type === "samsungpay"
                                                            ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                                            : type === "applepay"
                                                                ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                                : { name: "", cardType: "" };

                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                        "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "FAILED",
                                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                                        "Company": currentGasContract.COMPANY,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentType": "INVOICE_PAYMENT"
                                                    })
                                                }

                                            })
                                            .catch(getOrderDetailsErr => {
                                                this.setState({ makePaymentClicked: false })
                                                this.toastIt("Payment Failed")
                                                clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                            })



                                    }
                                    else {
                                        this.setState({ makePaymentClicked: false })
                                        this.toastIt("Payment Failed")

                                        const paidCardDetails =
                                            type === "samsungpay"
                                                ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                                : type === "applepay"
                                                    ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                    : { name: "", cardType: "" };

                                        this.props.updatePaymentLog({
                                            "OrderId": createOrderRes.reference,
                                            "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                            "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                            "OnlineDocDate": new Date(),
                                            "Status": "FAILED",
                                            "ContractNo": currentGasContract.CONTRACT_NO,
                                            "Company": currentGasContract.COMPANY,
                                            "TransactionId": createOrderRes.reference,
                                            "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                            "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                            "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                            "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentType": "INVOICE_PAYMENT"
                                        })
                                    }

                                } catch (err) {
                                    this.setState({ makePaymentClicked: false })
                                    this.toastIt("Payment Failed")

                                    const paidCardDetails =
                                        type === "samsungpay"
                                            ? { name: "SAMSUNG_PAY", cardType: "DEBIT" }
                                            : type === "applepay"
                                                ? { name: "APPLE_PAY", cardType: "DEBIT" }
                                                : { name: "", cardType: "" };

                                    this.props.updatePaymentLog({
                                        "OrderId": createOrderRes.reference,
                                        "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                        "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                        "OnlineDocDate": new Date(),
                                        "Status": "FAILED",
                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                        "Company": currentGasContract.COMPANY,
                                        "TransactionId": createOrderRes.reference,
                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentMode": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentType": "INVOICE_PAYMENT"
                                    })
                                }
                            }
                            else {
                                try {
                                    const initiateCardPaymentResponse = await initiateCardPayment(createOrderRes);
                                    if (initiateCardPaymentResponse.status == "Success") {

                                        token = await this.getPaymentGatewayAccessToken(apiKey, tokenApiUrl)
                                        createOrderHeader.Authorization = 'Bearer ' + token
                                        await axios.get(orderApiUrl + outLetReference + "/orders/" + createOrderRes.reference, { headers: createOrderHeader })
                                            .then(getOrderDetailsRes => {
                                                //console.log('status ', getOrderDetailsRes._embedded.payment[0].state=="CAPTURED")
                                                //console.log('status', getOrderDetailsRes);
                                                if (getOrderDetailsRes &&
                                                    (getOrderDetailsRes._embedded.length != 0) &&
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod && getOrderDetailsRes._embedded.payment[0].state=="CAPTURED" &&
                                                    getOrderDetailsRes._embedded.payment[0].paymentMethod.name) {

                                                    paidCardDetails = getOrderDetailsRes._embedded.payment[0].paymentMethod
                                                    this.toastIt("Payment Successful. It will be reflected in your account shortly.")
                                                    let reqBody = {
                                                        "COMPANY": currentGasContract.COMPANY,
                                                        "CONTRACT_NO": currentGasContract.CONTRACT_NO,
                                                        "BUILDING_CODE": currentGasContract.BUILDING_CODE,
                                                        "APARTMENT_CODE": currentGasContract.APARTMENT_CODE,
                                                        "AMT": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                        "YEARCODE": currentDate.getFullYear(),
                                                        "INV_DOCNO": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                                        "INV_DOCTYPE": currentGasContract.LAST_INVDOCTYPE != "" ? currentGasContract.LAST_INVDOCTYPE : this.state.currInvDocType,
                                                        "INV_YEARCODE": currentGasContract.LAST_YEARCODE != "" ? currentGasContract.LAST_YEARCODE : this.state.currInvYearCode,
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
                                                        this.props.updatePaymentLog({
                                                            "OrderId": createOrderRes.reference,
                                                            "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                            "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                            "OnlineDocDate": new Date(),
                                                            "Status": "SUCCESS",
                                                            "ContractNo": currentGasContract.CONTRACT_NO,
                                                            "Company": currentGasContract.COMPANY,
                                                            "TransactionId": createOrderRes.reference,
                                                            "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                                            "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE != "" ? currentGasContract.LAST_INVDOCTYPE : this.state.currInvDocType,
                                                            "InvoiceYearCode": currentGasContract.LAST_YEARCODE != "" ? currentGasContract.LAST_YEARCODE : this.state.currInvYearCode,
                                                            "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                            "PaymentMode": paidCardDetails.cardType != null ? paidCardDetails.cardType : "",
                                                            "PaymentType": "INVOICE_PAYMENT"
                                                        })
                                                    })
                                                } else {

                                                    
                                                    console.log('status ', getOrderDetailsRes)
                                                    this.setState({ makePaymentClicked: false })
                                                    this.toastIt("Payment Failed please try another method")
                                                    this.props.updatePaymentLog({
                                                        "OrderId": createOrderRes.reference,
                                                        "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                        "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                                        "OnlineDocDate": new Date(),
                                                        "Status": "FAILURE",
                                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                                        "Company": currentGasContract.COMPANY,
                                                        "TransactionId": createOrderRes.reference,
                                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                                        "PaymentMode": paidCardDetails.cardType != null ? paidCardDetails.cardType : "",
                                                        "PaymentType": "INVOICE_PAYMENT"
                                                    })
                                                }

                                            })
                                            .catch(getOrderDetailsErr => {
                                                console.log('status ', getOrderDetailsRes)
                                                clg("getOrderDetailsErr >> ", getOrderDetailsErr)
                                            })



                                    } else {
                                        this.props.updatePaymentLog({
                                            "OrderId": createOrderRes.reference,
                                            "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                            "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                            "OnlineDocDate": new Date(),
                                            "Status": "FAILURE",
                                            "ContractNo": currentGasContract.CONTRACT_NO,
                                            "Company": currentGasContract.COMPANY,
                                            "TransactionId": createOrderRes.reference,
                                            "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                            "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                            "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                            "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                            "PaymentMode": paidCardDetails.cardType != null ? paidCardDetails.cardType : "",
                                            "PaymentType": "INVOICE_PAYMENT"
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
                                    this.props.updatePaymentLog({
                                        "OrderId": createOrderRes.reference,
                                        "TotalAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                        "ReceivedAmount": this.state.payOtherAmount ? parseFloat(this.state.otherAmt) : Math.round(parseFloat(currentGasContract.OUTSTANDING_AMT) * 100) / 100,
                                        "OnlineDocDate": new Date(),
                                        "Status": initiatePaymentErr.status,
                                        "ContractNo": currentGasContract.CONTRACT_NO,
                                        "Company": currentGasContract.COMPANY,
                                        "TransactionId": createOrderRes.reference,
                                        "InvoiceDocNo": currentGasContract.LAST_INVDOCNO != "" ? currentGasContract.LAST_INVDOCNO : this.state.currentInvoice,
                                        "InvoiceDocType": currentGasContract.LAST_INVDOCTYPE,
                                        "InvoiceYearCode": currentGasContract.LAST_YEARCODE,
                                        "CreditCard": paidCardDetails.name != null ? paidCardDetails.name : "",
                                        "PaymentMode": paidCardDetails.cardType != null ? paidCardDetails.cardType : "",
                                        "PaymentType": "INVOICE_PAYMENT"
                                    })
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
    }}


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
                this.toastIt("Something went wrong. Try again later.")
            })
        return token
    }

    toastIt = (message) => {
        this.setState({
            showModal: true,
            readingResult: message,
        });
        setTimeout(() => {
            this.setState({ showToast: false, toastMessage: "" });
        }, 5000);
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={styles.headerCol1}>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image>
                            </TouchableOpacity>
                            <Text style={styles.welcomeLabel} >
                                Payment
                            </Text>
                        </View>
                    </View>
                    <View style={{ ...styles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                    </View>
                </View>

                {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}>
                    <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                        style={{ flex: 1 }}
                        enabled
                        showsVerticalScrollIndicator={false}
                    > */}
                <View style={{
                    height: Platform.OS == 'ios' ? "90%" : "100%", backgroundColor: "#FFFFFF", overflow: 'hidden',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    width: '100%'
                }} >
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
                                this.props.contracts.length ?
                                    <>
                                        <View style={{ ...styles.accountsLabelView, marginTop: 30 }}>
                                            <Text style={styles.accountsLabel} >
                                                {t("home.selectAccount")}
                                            </Text>
                                        </View>
                                        <HomeMainCard
                                            contracts={this.props.contracts}
                                            from="payment"
                                            usageCharges={1234}
                                            userName="User NameX"
                                            accountNumber="YYYY XXXX YYYY XXXX"
                                            currentIndex={this.carouselCurrentItem}
                                            makePayment={() => this.makePayment("")}
                                            loading={this.state.makePaymentClicked}
                                        />


                                        <View style={{ ...styles.amountView }}>
                                            <View style={{ flexDirection: "row", }}>
                                                <View style={styles.amountCol1}>
                                                    <Text style={styles.accountLabel} >
                                                        Total Amount Due
                                                    </Text>
                                                </View>
                                                <View style={styles.amountCol2}>
                                                    <Text style={styles.userNameLabel} >
                                                        {this.props.contracts[this.state.activeItemIndex].OUTSTANDING_AMT > 0 ? Math.round(parseFloat(this.props.contracts[this.state.activeItemIndex].OUTSTANDING_AMT) * 100) / 100 : 0} AED
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ ...styles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", marginBottom: 0, minHeight: 40 }}>
                                            <View style={styles.headerCol1}>
                                                <TouchableOpacity style={this.state.payOtherAmount ? { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1 } : { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1, backgroundColor: "#102D4F" }}
                                                    onPress={() => { this.setState({ payOtherAmount: false }) }}>
                                                    {/* <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image> */}
                                                </TouchableOpacity>
                                                <Text style={styles.preferrenceLabel} >
                                                    Pay total outstanding amount
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", marginTop: 0, marginBottom: 20 }}>
                                            <View style={{ ...styles.headerCol1 }}>
                                                <TouchableOpacity style={this.state.payOtherAmount ? { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 1, backgroundColor: "#102D4F" } : { marginRight: 5, height: 16, width: 16, borderRadius: 8, borderColor: "#8E9093", borderWidth: 0.4 }}
                                                    onPress={() => { this.setState({ payOtherAmount: true }) }}>
                                                    {/* <Image source={Images.BackButton} style={{ height: 40, width: 40, }}></Image> */}
                                                </TouchableOpacity>
                                                <View style={{ width: "100%" }}>

                                                    {
                                                        this.state.payOtherAmount ?
                                                            <>
                                                                <Text style={styles.preferrenceLabel} >
                                                                    Enter amount
                                                                </Text>
                                                                <TextInput
                                                                    ref={this.otherAmtRef}
                                                                    onFocus={() => {
                                                                        setTimeout(() => {
                                                                            this.otherAmtRef.current.focus()
                                                                        }, 1000)
                                                                    }}
                                                                    placeholder="Enter other amount"
                                                                    style={styles.textInputStyle}
                                                                    value={this.state.otherAmt}
                                                                    onChangeText={val => {
                                                                        this.setState({ otherAmt: val }, () => {
                                                                        })
                                                                    }}
                                                                    keyboardType='numeric'
                                                                />

                                                            </> : <Text style={styles.preferrenceLabel} >
                                                                Pay other amount
                                                            </Text>
                                                    }


                                                    {/* <Text style={{ ...styles.preferrenceLabel, fontSize: 10 }} >
                                                                Additional charges apply for Immediate Connection + Associated Fees : 105 AED
                                                            </Text> */}
                                                </View>

                                            </View>

                                        </View>

                                        {
                                            this.state.payOtherAmount && (this.state.otherAmt != '') && ((parseFloat(this.state.otherAmt) < 10)) ?
                                                <Text style={{ fontSize: 12, color: "red" }}>
                                                    Minimum amount to be paid - 10 AED.
                                                </Text> : this.state.payOtherAmount && (this.state.otherAmt != '') && !(/^(\d)*(\.)?([0-9]{1,2})?$/.test(this.state.otherAmt)) ?
                                                    <Text style={{ fontSize: 12, color: "red" }}>
                                                        Invalid amount
                                                    </Text> : null
                                        }

                                        {this.state.cardPaySupported ? (
                                            <TouchableOpacity
                                                style={(this.props.contracts[this.state.activeItemIndex].OUTSTANDING_AMT > 0) && !(this.state.payOtherAmount && ((this.state.otherAmt == '') || (parseFloat(this.state.otherAmt) < 10) || !(/^(\d)*(\.)?([0-9]{1,2})?$/.test(this.state.otherAmt)))) ? styles.buttonStyle : { ...styles.buttonStyle, backgroundColor: "#99b1d1" }}
                                                onPress={() => this.makePayment("")}
                                                disabled={(!(this.props.contracts[this.state.activeItemIndex].OUTSTANDING_AMT > 0)) || (this.state.payOtherAmount && ((this.state.otherAmt == '') || (parseFloat(this.state.otherAmt) < 10) || !(/^(\d)*(\.)?([0-9]{1,2})?$/.test(this.state.otherAmt))))}
                                            >
                                                {this.state.makePaymentClicked && (this.state.payMode == "") ?
                                                    <ActivityIndicator size={'small'} color={'black'} /> :
                                                    <>
                                                        <Text
                                                            style={styles.buttonLabelStyle}>Pay</Text>

                                                    </>
                                                }
                                            </TouchableOpacity>
                                        ) : null}
                                        {
                                            this.state.applePaySupported || this.state.samsungPaySupported ?

                                                <TouchableOpacity
                                                    style={(this.props.contracts[this.state.activeItemIndex].OUTSTANDING_AMT > 0) && !(this.state.payOtherAmount && ((this.state.otherAmt == '') || (parseFloat(this.state.otherAmt) < 10) || !(/^(\d)*(\.)?([0-9]{1,2})?$/.test(this.state.otherAmt)))) ? { ...styles.buttonStyle, marginTop: 20 } : { ...styles.buttonStyle, backgroundColor: "#99b1d1", marginTop: 20 }}
                                                    onPress={() => {
                                                        this.setState({
                                                            payMode: this.state.applePaySupported ? "applepay" : "samsungpay"
                                                        })
                                                        this.makePayment(this.state.applePaySupported ? "applepay" : "samsungpay")
                                                    }}
                                                    disabled={(!(this.props.contracts[this.state.activeItemIndex].OUTSTANDING_AMT > 0)) || (this.state.payOtherAmount && ((this.state.otherAmt == '') || (parseFloat(this.state.otherAmt) < 10) || !(/^(\d)*(\.)?([0-9]{1,2})?$/.test(this.state.otherAmt))))}
                                                >
                                                    {this.state.makePaymentClicked && ((this.state.payMode == "applepay") || (this.state.payMode == "samsungpay")) ?
                                                        <ActivityIndicator size={'small'} color={'black'} /> :
                                                        <>
                                                            {/* <Text
                                                            style={styles.buttonLabelStyle}>{this.state.applePaySupported ? "Pay using Apple Pay" : "Pay using Samsung Pay"}</Text> */}
                                                            {
                                                                this.state.applePaySupported ? <Image source={require("../../../assets/images/Apple_Pay.png")} style={{ height: 25, resizeMode: "contain" }} /> :
                                                                    <Image source={require("../../../assets/images/Samsung_Pay.png")} style={{ height: 30, resizeMode: "contain" }} />
                                                            }
                                                        </>
                                                    }
                                                </TouchableOpacity>
                                                : null
                                        }


                                    </>
                                    :
                                    null}



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
                                        this.makePayment("")
                                    }}
                                    data={{
                                        // title: "Immediate Disconnection",
                                        // message: "Test",
                                        button1Text: "Close",
                                        button2Text: "Pay",
                                        uri: this.state.helpImageUrl,
                                        view: <View style={{ alignItems: 'center', width: "100%" }}>
                                            <Image style={{ width: 66.34, height: 88, resizeMode: "stretch", marginBottom: 30 }}
                                                source={this.state.readingResult == "Payment Successful. It will be reflected in your account shortly." ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png")}
                                            // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                            />

                                            <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={styles.inputLabelStyle}>{this.state.readingResult == "Payment Successful. It will be reflected in your account shortly." ? "Thank You" : "Technical Error"} </Text>
                                            </View>

                                            <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                <Text style={styles.accountNumberText}>{this.state.readingResult}</Text>
                                            </View>
                                            {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                            <TouchableOpacity
                                                style={{ ...styles.buttonStyle, width: "100%" }}
                                                onPress={() => {
                                                    this.setState({
                                                        showModal: false
                                                    })
                                                    this.state.readingResult !== "Payment Successful. It will be reflected in your account shortly." ? null : this.props.navigation.goBack()
                                                }}
                                            >
                                                <Text
                                                    style={styles.buttonLabelStyle}>{this.state.readingResult !== "Payment Successful. It will be reflected in your account shortly." ? "Go Back" : "Done"}</Text>
                                            </TouchableOpacity>

                                            {/* </View> */}

                                        </View>
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                /> :
                                null
                        }
                    </KeyboardAwareScrollView>
                </View>
                {/* </InfoContainer> */}
                {this.state.showToast ? (
                    <Toast message={this.state.toastMessage} isImageShow={false} />
                ) : null}
                {/* </ImageBackground> */}
            </SafeAreaView>






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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(Payment, {
    methods: {
        updatePayment: {
            type: 'post',
            moduleName: 'api',
            url: 'UpdatePayment',
            authenticate: true,
        },
        updatePaymentLog: {
            type: 'post',
            moduleName: 'api',
            url: 'PaymentLog',
            authenticate: true,
        },
        getAllContracts: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getContractsByMobile',
            authenticate: false,
        },
        getLatestInvoice: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getLatestInvoice',
            authenticate: true,
        },
    }
}))

// <SafeAreaView style={{
//     backgroundColor: '#FFFFFF',
//     flex: 1,
// }} >
//     <Image
//             style={{
//                 width: "100%",
//                 zIndex: 1,
//                 backgroundColor: "transparent",
//                 position: 'absolute'
//             }}
//             source={require("../../../assets/images/miniHeader.png")}
//         />
//                             <View style={styles.headerView}>
//             <View style={{ flexDirection: "row", }}>
//                 {/* <Text style={styles.pageHeader}>{t("pages.billsAndPayment")}</Text> */}
//                 {
//                     this.props.contracts.length ?
//                         <>
//                             <View style={styles.headerCol1}>
//                                 <Text style={styles.pageHeader}>
//                                     {this.props.contracts[this.state.activeItemIndex].CONTRACT_NO}
//                                 </Text>
//                             </View>
//                             <View style={styles.headerCol2}>
//                                 <TouchableOpacity onPress={() => this.props.navigation.navigate('My Links', { screen: 'myAccounts' })}>
//                                     <Image
//                                         source={require("../../../assets/images/profile.png")}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                         </>
//                         :
//                         <>
//                         <View style={styles.headerCol1}>
//                             <Text style={styles.pageHeader}>
//                                 No Contracts
//                             </Text>
//                         </View>
//                         <View style={styles.headerCol2}>
//                         </View>
//                     </>
//                 }

//             </View>
//             <View style={styles.cardHeader}>
//                 {/* <Image
//                     source={require("../../../assets/images/HomeProfile.png")}
//                     style={styles.HomeProfileImage} />
//                 <View style={styles.profileLabelView}>
//                     <Text style={styles.cardHeaderText}>{this.props.contracts.length ? this.props.contracts[0].PARTYNAME : ''}</Text>
//                     <Text style={styles.accountNumberText}>{this.props.contracts.length ? this.props.contracts[0].USER_ID : ''}</Text>
//                 </View> */}
//             </View>
//         </View>
//     <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : null}
//         style={{
//             flex: 1,
//             backgroundColor: "rgba(255,255,255,0)",
//             // alignItems: 'center'
//         }}
//         enabled
//     >



//         <ScrollView
//             ref={(ref) => (this.scrollView = ref)}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollView}>

//             {/* <View style={styles.cardView} >
//                 <View style={styles.paymentDueRow1}>
//                     <Text style={styles.accountNumberText}>{t("home.paymentDueUpto")}</Text>
//                 </View>
//                 <View style={styles.paymentDueRow2}>
//                     <View style={styles.amountView}>
//                         <Text style={styles.amountText}>1234</Text>
//                         <Text style={styles.aedText}>{t("home.aed")}</Text>
//                     </View>
//                     <TouchableOpacity style={styles.payBillView}>
//                         <Text style={styles.payBillText}>{t("home.payBill")}</Text>
//                         <Image
//                             source={require('../../../assets/images/click.png')}
//                             style={styles.clickImage}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </View> */}

//             {/* <View style={styles.accountsLabelView}>
//                 <Text style={styles.accountsLabel} >
//                     {t("home.accounts")}
//                 </Text>
//             </View> */}



//             {/* <View style={{ ...styles.cardView, ...{ backgroundColor: "rgba(223, 231, 240, 1)", minHeight: 0 } }} >
//                 <View style={styles.paymentDueRow1}>
//                 <Text style={styles.notCustomerText}>{t("payment.saveTime")}</Text>
//                 </View>
//                 <View style={styles.paymentDueRow1}>
//                 <Text style={styles.accountNumberText}>{t("payment.enjoyPeaceOfMind")}</Text>
//                 </View>
//                 <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}>
//                     <Text style={styles.payBillText}>{t("payment.setItUpNow")}</Text>
//                     <Image
//                     source={require('../../../assets/images/click.png')}
//                     style={styles.clickImage}
//                     />
//                 </TouchableOpacity>
//             </View> */}


//             {this.props.contracts.length ?
//                 (
//                     <>
//                         <HomeMainCard
//                             contracts={this.props.contracts}
//                             from="payment"
//                             usageCharges={1234}
//                             userName="User NameX"
//                             accountNumber="YYYY XXXX YYYY XXXX"
//                             currentIndex={this.carouselCurrentItem}
//                             makePayment={this.makePayment}
//                             loading={this.state.makePaymentClicked}
//                         />
//                         <View style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }} >
//                             {/* <View style={styles.optionIconViewCol1}>
//                     <Image
//                     source={require('../../../assets/images/optionIcon.png')}
//                     />
//                 </View> */}
//                             <View style={styles.optionIconViewCol1}>
//                                 <View >
//                                     <Text style={styles.billHistoryText}>{t("payment.billHistory")}</Text>
//                                 </View>
//                                 <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5, paddingHorizontal: 0 } }}
//                                     onPress={() => this.props.navigation.navigate("statement")}
//                                 // onPress={this.handleEmail}
//                                 >
//                                     <Text style={styles.payBillText}>{t("payment.viewLast6MonthsBill")}</Text>
//                                     <Image
//                                         source={require('../../../assets/images/click.png')}
//                                         style={styles.clickImage}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         <View style={styles.cardView} >
//                             {/* <View style={styles.paymentDueRow1}>
//                                 <Text style={styles.notCustomerText}>{t("home.meterReading")}</Text>
//                             </View> */}
//                             <View style={styles.paymentDueRow1}>
//                                 <Text style={styles.billHistoryText}>{t("home.updateRadingYourself")}</Text>
//                             </View>
//                             <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
//                                 onPress={() => this.props.navigation.navigate("submitReading")}
//                             >
//                                 <Text style={styles.payBillText}>{t("home.submitMeterReading")}</Text>
//                                 <Image
//                                     source={require('../../../assets/images/click.png')}
//                                     style={styles.clickImage}
//                                 />
//                             </TouchableOpacity>
//                         </View>
//                         <View style={{ ...styles.cardView, ...{ minHeight: "auto" } }} >
//                             <View style={styles.paymentDueRow1}>
//                                 <Text style={styles.billHistoryText}>{t("home.wantDisconnection")}</Text>
//                             </View>
//                             <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }} onPress={() => this.props.navigation.navigate("disconnection")}>
//                                 <Text style={styles.payBillText}>{t("home.requestDisConnection")}</Text>
//                                 <Image
//                                     source={require('../../../assets/images/click.png')}
//                                     style={styles.clickImage}
//                                 />
//                             </TouchableOpacity>
//                         </View>

//                     </>
//                 )
//                 : null}
//             <View style={{ ...styles.cardView, ...{ minHeight: "auto" } }} >
//                 <View style={styles.paymentDueRow1}>
//                     <Text style={styles.billHistoryText}>{t("home.wantConnection")}</Text>
//                 </View>
//                 <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }} onPress={() => this.props.navigation.navigate("reqNewConn")}>
//                     <Text style={styles.payBillText}>{t("home.requestNewConnection")}</Text>
//                     <Image
//                         source={require('../../../assets/images/click.png')}
//                         style={styles.clickImage}
//                     />
//                 </TouchableOpacity>
//             </View>


//         </ScrollView>
//         {this.state.showToast ? (
//             <Toast message={this.state.toastMessage} isImageShow={false} />
//         ) : null}
//     </KeyboardAvoidingView>
// </SafeAreaView>

{/* {
                                this.props.contracts.length ?
                                    <>
                                        <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                        // onPress={() => { Linking.openURL(`tel:600565657`) }}
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Image
                                                    style={styles.icon}
                                                    source={require('../../../assets/images/StatementHome1.png')}
                                                />
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Text style={styles.accountNumberText}>{t("support.emergency")}</Text>
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
                                        </TouchableOpacity>
                                    </>
                                    :
                                    null} */}

{/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                            // onPress={() => { Linking.openURL(`tel:600565657`) }}
                            >
                                <View style={styles.optionIconViewCol1}>
                                    <Image
                                        style={styles.icon}
                                        source={require('../../../assets/images/SavedCardsHome1.png')}
                                    />
                                </View>
                                <View style={styles.optionIconViewCol2}>
                                    <Text style={styles.accountNumberText}>{t("support.emergency")}</Text>
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


{/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row', marginTop: 20 } }}
                                        // onPress={() => { Linking.openURL(`tel:600565657`) }}
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Image
                                                    style={styles.icon}
                                                    source={require('../../../assets/images/MakePaymentHome1.png')}
                                                />
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Text style={styles.accountNumberText}>{t("support.emergency")}</Text>
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
                                        </TouchableOpacity> */}
{/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
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
                                </TouchableOpacity> */}



