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
import * as PaymentService from '../../services/paymentService'
import postLocalNotification from '../../services/NotificationService'
import { Notifications } from 'react-native-notifications';
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
                        //postLocalNotification("Disconnection Alert","Request successful for Disconnection","NotificationDetail");
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
                    //postLocalNotification("Disconnection Alert","Request successful for Disconnection","NotificationDetail");
                    this.toastIt("Request successful for Disconnection", true)
                } else {
                    this.toastIt("Request successful for Disconnection", true)
                    //postLocalNotification("Disconnection Alert","Request successful for Disconnection","NotificationDetail");
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
    handleSaveCard = async () => {
        this.setState({ showSaveCardModal: false });
        console.log("AAAA");
        const { orderReference, paymentMethod, token } = this.savedCardContext;
        console.log("Saved Card Context:", this.savedCardContext);
        try {
            const response = await PaymentService.saveCardDetails(orderReference, paymentMethod, token);
            console.log("BBB");
            if (response.success) {
                this.toastIt("Card saved successfully!", true);
            } else {
                throw new Error("Card save failed");
            }
        } catch (error) {
            console.error("Card Save Error:", error);
            this.toastIt("Failed to save card", false);
        }
    };

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


    makePayment = async (paymentType, contract, otherAmount) => {
        const currentGasContract = this.props.contracts[this.state.activeItemIndex];
        const currDate = new Date().toLocaleDateString('en-US');
        const currentDate = new Date();

        const extractErrorMessage = (error) => {
            if (error?.response?.data?.message) {
                return error.response.data.message;
            }
            if (error?.message) {
                return error.message;
            }
            if (error?.response?._response) {
                try {
                    const parsed = JSON.parse(error.response._response);
                    return parsed.Message || parsed.message || "Unknown gateway error";
                } catch {
                    return error.response._response;
                }
            }
            return "Payment initiation failed due to unknown error";
        };

        try {
            const { outletReference, apiKey, tokenApiUrl, orderApiUrl } =
                PaymentService.getCompanyDetails(currentGasContract.COMPANY, API_PATH);

            let token = await PaymentService.getPaymentGatewayAccessToken(apiKey, tokenApiUrl);
            if (!token) throw new Error("Access token missing");

            const traceId = await PaymentService.generateTraceId();
            const amount = PaymentService.getPaymentAmount(currentGasContract, 105);
            const orderPayload = PaymentService.buildCreateOrderRequest(currentGasContract, amount, traceId);
            const orderResponse = await PaymentService.createPaymentOrder(orderApiUrl, outletReference, orderPayload, token);
            console.log("Payment State:", orderPayload);
            console.log("Payment Method:", orderResponse);
            const paidAmountFils = orderResponse?._embedded?.payment?.[0]?.amount?.value || 0;
            const paidAmount = paidAmountFils / 100;
            if (!orderResponse) throw new Error("Order creation failed");

            let paymentResponse = null;
            let paymentInitiated = false;
            let initiationErrorMessage = "";

            try {
                paymentResponse = await PaymentService.initiatePaymentFlow(paymentType, orderResponse, currentGasContract.COMPANY);
                paymentInitiated = paymentResponse?.status === "Success";
            } catch (err) {
                console.error("🚨 Payment initiation error:", err);
                initiationErrorMessage = extractErrorMessage(err);
            }

            const getCardDetails = (type) => {
                const map = {
                    samsungpay: { name: "SAMSUNG_PAY", cardType: "DEBIT" },
                    applepay: { name: "APPLE_PAY", cardType: "DEBIT" },
                };
                return map[type] || { name: "CARD_PAYMENT", cardType: "DEBIT" };
            };

            const logPayment = (status, receivedAmount, remarks, orderStatus = {}) => {
                const card = orderStatus?.paymentMethod || getCardDetails(paymentType);
                this.props.updatePaymentLog({
                    OrderId: orderResponse.reference,
                    TotalAmount: paidAmount,
                    ReceivedAmount: receivedAmount,
                    OnlineDocDate: new Date(),
                    Status: status,
                    ContractNo: currentGasContract.CONTRACT_NO,
                    Company: currentGasContract.COMPANY,
                    TransactionId: orderResponse.reference,
                    InvoiceDocNo: currentGasContract.LAST_INVDOCNO,
                    InvoiceDocType: currentGasContract.LAST_INVDOCTYPE,
                    InvoiceYearCode: currentGasContract.LAST_YEARCODE,
                    CreditCard: card.cardType || card.name || "",
                    PaymentMode: card.name || "",
                    PaymentType: "DISCONNECTION",
                    Remarks: remarks
                });
            };

            if (!paymentInitiated) {
                this.setState({ makePaymentClicked: false });
                const reason = initiationErrorMessage || "Payment not initiated or cancelled by user";
                this.toastIt(reason, false);
                logPayment("CANCELLED", 0, reason);
                return { status: "CANCELLED", reason };
            }

            token = await PaymentService.getPaymentGatewayAccessToken(apiKey, tokenApiUrl);
            const orderStatus = await PaymentService.fetchOrderStatus(orderApiUrl, outletReference, orderResponse.reference, token);
            const paymentState = orderStatus?._embedded?.payment?.[0]?.state;
            const paymentMethod = orderStatus?._embedded?.payment?.[0]?.paymentMethod;

            let status, reason;

            switch (paymentState) {
                case "CAPTURED":
                    const paidAmountFils = orderStatus?._embedded?.payment?.[0]?.amount?.value || 0;
                    const paidAmount = paidAmountFils / 100;
                    const updatePaymentReqBody = {
                        COMPANY: currentGasContract.COMPANY,
                        CONTRACT_NO: currentGasContract.CONTRACT_NO,
                        YEARCODE: currentDate.getFullYear(),
                        REC_DOC_TYPE: "GREC",
                        INV_NO: currentGasContract.LAST_INVDOCNO,
                        INV_DOC_TYPE: "GINC",
                        INV_DATE: this.formatDate(currentDate.toDateString()),
                        INV_YEAR_CODE: currentDate.getFullYear(),
                        INV_AMT: String(paidAmount),
                        REC_AMT: String(paidAmount),
                        DATE: currDate,
                        USER_ID: currentGasContract.USER_ID,
                        DEVICE_ID: await DeviceInfo.getUniqueId(),
                    };

                    const createCollectionReqBody = {
                        COMPANY: currentGasContract.COMPANY,
                        CONTRACT_NO: currentGasContract.CONTRACT_NO,
                        DEVICE_ID: await DeviceInfo.getUniqueId(),
                        DATE: currDate,
                        AMOUNT: 100,
                        REMARKS: "URGENT DISCONNECTION - MOBILE APP",
                        USER_ID: currentGasContract.USER_ID,
                        YEAR_CODE: currentDate.getFullYear(),
                        CHARGE_TYPE: "UDF",
                        CHARGE_DESCP: "URGENT DISCONNECTION FEE",
                        YEARCODE: currentDate.getFullYear()
                    };

                    const disconnectionReqBody = {
                        USER_ID: currentGasContract.USER_ID,
                        CONTRACT_NO: currentGasContract.CONTRACT_NO,
                        COMPANY: currentGasContract.COMPANY,
                        DATE: new Date(),
                        PAYMENT_STATUS: "PAID",
                        PAYMENT_TXN_ID: orderResponse.reference,
                        BUILDING_CODE: currentGasContract.BUILDING_CODE,
                        APARTMENT_CODE: currentGasContract.APARTMENT_CODE,
                        PREFERRED_DATE_TIME: this.state.date,
                        PARTY_NAME: currentGasContract.PARTYNAME,
                        EID: currentGasContract.EID
                    };

                    this.setState({
                        updatePaymentReqBody,
                        createCollectionReqBody,
                        paidDisconnection: true,
                        apiCallFlags: { ...this.state.apiCallFlags, requestDisconnectionApiCalled: true }
                    }, () => {
                        this.props.requestDisconnection(disconnectionReqBody);
                    });


                    logPayment("CAPTURED", String(paidAmount), paymentState, paymentMethod);
                    //this.setState({ showSaveCardModal: true });

                    // Store necessary info temporarily for later card saving
                    this.savedCardContext = {
                        orderReference: orderResponse.reference,
                        paymentMethod,
                        token, // Optional: for authenticated follow-up request
                    };

                    return { status: "SUCCESS", reason: "Payment successful" };

                case "FAILED":
                    this.setState({ makePaymentClicked: false });
                    reason = orderStatus?._embedded?.payment?.[0]?.error?.message || "Payment failed";
                    this.toastIt("Payment Failed at capture verification", false);
                    logPayment("FAILED", 0, reason, paymentMethod);
                    return { status: "FAILED", reason };

                case "STARTED":
                    this.setState({ makePaymentClicked: false });
                    reason = "User cancelled payment";
                    this.toastIt("Payment Cancelled or Pending", false);
                    logPayment("CANCELLED", 0, reason, paymentMethod);
                    return { status: "CANCELLED", reason };

                default:
                    console.warn("❓ Unknown payment status received:", paymentState);
                    reason = `Unknown payment status: ${paymentState || 'null'}`;
                    logPayment("UNKNOWN", 0, reason, paymentMethod);
                    return { status: "UNKNOWN", reason };
            }

        } catch (error) {
            this.setState({ makePaymentClicked: false });
            const errorMsg = extractErrorMessage(error);
            this.toastIt("FAILED", false);
            console.error("🚨 Payment Error:", error);
            logPayment("FAILED", 0, errorMsg);
            return {
                status: "FAILED",
                reason: errorMsg
            };
        }
    };


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
                                                            <Text style={{ ...Mainstyles.preferrenceHeader, color: this.state.paidDisconnection ? '#102C4E' : '#102C4EB3' }} >
                                                                Immediate Disconnection
                                                            </Text>
                                                            <Text style={{ ...Mainstyles.preferrenceLabel }} >
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
                                                        <Text style={{ ...Mainstyles.preferrenceHeader, color: this.state.paidDisconnection ? '#102C4EB3' : '#102C4E', marginLeft: 10 }} >
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
                                                <Image style={{ resizeMode: "stretch", marginBottom: 30 }}
                                                    // source={this.state.readingResult == "Request successful for Disconnection" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/InternetError.gif")}
                                                    source={this.state.readingResult == "Request successful for Disconnection" ? require("../../../assets/images/Mail.gif") : require("../../../assets/images/InternetError.gif")}
                                                // source={this.state.readingResult == "" ? require("../../../assets/images/Done.gif") : require("../../../assets/images/InternetError.gif") }
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
                                                    style={{ ...Mainstyles.buttonStyle, marginBottom: 10, width: "100%", marginTop: 5 }}
                                                    onPress={() => {
                                                        this.setState({ showPaidModal: false })
                                                        this.makePayment("")
                                                    }}
                                                >
                                                    <Text style={Mainstyles.buttonLabelStyle}>Pay 105 AED now</Text>
                                                </TouchableOpacity>


                                                {
                                                    this.state.applePaySupported || this.state.samsungPaySupported ?

                                                        <TouchableOpacity
                                                            style={{...Mainstyles.buttonStyle, width:"100%"}}
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
                                                                    <Image source={require("../../../assets/images/Samsung_Pay.png")} style={{ ...Mainstyles.buttonLabelStyle, }} />
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
                                                <Image style={{  resizeMode: "stretch", marginBottom: 30 }}
                                                    source={require("../../../assets/images/Done.gif")}
                                                />

                                                <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.inputLabelStyle}>Almost there</Text>
                                                </View>

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={{ ...styles.accountNumberText, fontSize: 14, lineHeight: 20 }}>You are our special customer 😀. Let us assist you at your doorstep 🧑‍🔧.</Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={{ ...Mainstyles.buttonStyle, width: "100%" }}
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
                            {
                                this.state.showSaveCardModal ?
                                    <Modal
                                        close={false}
                                        onClose={() => this.setState({ showSaveCardModal: false })}
                                        visible={this.state.showSaveCardModal}
                                        data={{
                                            button1Text: "Close",
                                            view: (
                                                <View style={{ alignItems: 'center', width: "100%" }}>
                                                    <Image
                                                        style={{ resizeMode: "contain", marginBottom: 20 }}
                                                        source={require("../../../assets/images/Done.gif")} // Make sure to add this image
                                                    />
                                                    <Text style={styles.inputLabelStyle}>
                                                        Do you want to save your card for future payments?
                                                    </Text>

                                                    <TouchableOpacity
                                                        style={{ ...Mainstyles.buttonStyle, width: "100%", marginTop: 20 }}
                                                        onPress={this.handleSaveCard}
                                                    >
                                                        <Text style={Mainstyles.buttonLabelStyle}>Yes, Save Card</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={{ ...Mainstyles.buttonStyle, width: "100%", marginTop: 10 }}
                                                        onPress={() => this.setState({ showModal: false })}
                                                    >
                                                        <Text style={Mainstyles.buttonLabelStyle}>No, Thanks</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
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