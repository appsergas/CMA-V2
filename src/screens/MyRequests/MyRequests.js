import Mainstyles from '../../styles/globalStyles'
import styles from './MyRequestsStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import axios from 'axios'
import { setI18nConfig, translationGetters, t } from '../../services/translate/i18n'
import * as RNLocalize from 'react-native-localize';
import TextInputControl from '../../controls/TextInput'
import PropTypes from 'prop-types'
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withApiConnector from '../../services/api/data/data/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextInput from '../../controls/TextInput'
import Toast from '../../controls/Toast'
import DatePicker from 'react-native-date-picker'
import HomeMainCard from '../../components/HomeMainCard';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';
import { ArrowIcon } from '../../../assets/icons'

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
import {
    initiateCardPayment,
    initiateSamsungPay,
    initiateApplePay,
} from '@network-international/react-native-ngenius';
import Modal from '../../controls/Modal'
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';



class MyRequests extends Component {
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
            requests: [],
            apiCallFlags: {
                getRequestsCalled: true,
                singleContractDetailsCalled: false,
                payContractRecApiCalled: false,
                getAllContractsCalled: false,
                updateRequestCalled: false,
                updateRequestInitialCalled: false,
                createCollectionInvoiceCalled: false,
                createInvoiceReceiptCalled: false
            },
            showPayModal: false,
            payContractNumber: null,
            payCompany: null,
            payAmount: null,
            payContract: null,
            date: new Date(new Date().getTime() + (2 * 86400000)),
            createRecReqBody: null,
            toastMessage: "",
            showToast: false,
            currentTransaction: null,
            payType: "VIP",
            payContractRecReqBody: null,
            cancelRequest: false
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        this.props.getMyRequests({
            "USER_ID": await AsyncStorage.getItem("sergas_customer_mobile_number")
        })
    }

    async componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        // this.setState({
        //     apiCallFlags: { ...this.state.apiCallFlags, ...{ getRequestsCalled: true } }
        // }, async () => {
        //     this.props.getMyRequests({
        //     "USER_ID": await AsyncStorage.getItem("sergas_customer_mobile_number")
        // })
        // }
        //     )
    }

    componentWillReceiveProps(nextProps) {
        const { getMyRequestsResult, singleContractDetailsResult, payContractRecResult, createCollectionInvoiceResult, createInvoiceReceiptResult, updateRequestResult } = nextProps;
        if (this.state.apiCallFlags.getRequestsCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getRequestsCalled: false } }
            }, () => {
                if (getMyRequestsResult && getMyRequestsResult.content) {
                    this.setState({ requests: getMyRequestsResult.content })
                }
            })
        }

        if (this.state.apiCallFlags.singleContractDetailsCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ singleContractDetailsCalled: false } }
            }, () => {
                if (singleContractDetailsResult && singleContractDetailsResult.content) {
                    // if (singleContractDetailsResult.content.OUTSTANDING_AMT > 0 || singleContractDetailsResult.content.CONTRACT_NO != undefined) {
                    this.setState({
                        payContract: singleContractDetailsResult.content
                    }, () => {
                        this.getPayableAmount()
                        // this.setState({
                        //     showPayModal: true,
                        //     payContractNumber: singleContractDetailsResult.content.CONTRACT_NO,
                        //     payCompany: singleContractDetailsResult.content.COMPANY,
                        //     payAmount: singleContractDetailsResult.content.OUTSTANDING_AMT
                        // })
                    })

                    // } else {
                    //     //Toast here
                    // }
                }
            })
        }

        if (this.state.apiCallFlags.payContractRecApiCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ payContractRecApiCalled: false, } }
            }, () => {
                if (payContractRecResult && payContractRecResult.content && (payContractRecResult.content.STATUS == "1|SUCESS")) {
                    // this.toastIt("Complaint posted sucessfully")
                    // this.setState({
                    //     apiCallFlags: {...this.state.apiCallFlags,getAllContractsCalled: true}
                    // }, () => {
                    //     this.props.getAllContracts({
                    //         MobileNumber: this.state.payContract.MOBILE
                    //     })
                    // })
                    this.setState({
                        apiCallFlags: { ...this.state.apiCallFlags, updateRequestCalled: true }
                    }, () => {
                        this.props.updateRequest({
                            "ID": this.state.currentTransaction.ID,
                            "PAYMENT_STATUS": "PAID",
                            "PAYMENT_TXN_ID": this.state.payContractRecReqBody.TRANSACTION_ID,
                            "REMARKS": this.state.payType,
                            "PREFERRED_DATE": this.state.payType == "VIP" ? this.state.date : "",
                            "USER_ID": "1",
                            "CONTRACT_RECEIPT_CREATED": true,
                            "CONTRACT_RECEIPT_NO": payContractRecResult.content.MSG
                        })
                    })

                } else {
                    /**
                     * Alterative way to update payment in Serp DB
                     */
                    this.setState({ currentTransaction: null })
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

        if (this.state.apiCallFlags.createCollectionInvoiceCalled) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ createCollectionInvoiceCalled: false, } },
                makePaymentClicked: false
            }, () => {
                if (createCollectionInvoiceResult && createCollectionInvoiceResult.content && (createCollectionInvoiceResult.content.STATUS == "1|SUCESS")) {

                    this.setState({
                        apiCallFlags: { ...this.state.apiCallFlags, ...{ createInvoiceReceiptCalled: true, createCollectionInvoiceCalled: false, } }
                    })
                    this.props.createInvoiceReceipt({
                        ...this.state.createRecReqBody, ...{
                            "INV_NO": createCollectionInvoiceResult.content.MSG,
                            "INV_DOC_TYPE": "GINC",
                            "INV_YEAR_CODE": new Date().getFullYear()
                        }
                    })
                } else {
                    /**
                     * Alterative way to update payment in Serp DB
                     */
                    this.setState({ currentTransaction: null })
                }
            })
        }

        if (this.state.apiCallFlags.createInvoiceReceiptCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ createInvoiceReceiptCalled: false, } },
                makePaymentClicked: false
            }, () => {
                if (createInvoiceReceiptResult && createInvoiceReceiptResult.content && (createInvoiceReceiptResult.content.MSG == "SUCESS")) {
                    this.setState({ currentTransaction: null })
                    this.toastIt("Payment updated successfully")

                } else {
                    this.setState({ currentTransaction: null })
                    this.toastIt("Payment updated successfully, will take some time to reflect in your account")
                }
            })
        }

        if (this.state.apiCallFlags.updateRequestCalled) {

            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ updateRequestCalled: false } },
                currentTransaction: null
            }, () => {
                if (updateRequestResult && updateRequestResult.content && (updateRequestResult.content.STATUS == "SUCCESS")) {
                    this.setState({ requests: [] })
                    this.toastIt("Request cancelled successfully")
                    this.setState({
                        apiCallFlags: { ...this.state.apiCallFlags, getRequestsCalled: true }
                    }, async () => {
                        this.props.getMyRequests({
                            "USER_ID": await AsyncStorage.getItem("sergas_customer_mobile_number")
                        })
                    })
                } else {
                    this.toastIt("Could not update request.")
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

    handlePay = (contractNo, company) => {
        this.setState({
            apiCallFlags: { ...this.state.apiCallFlags, ...{ singleContractDetailsCalled: true } }
        }, () => this.props.singleContractDetails({
            "contract": contractNo,
            "company": company
        })
        )
    }

    getPayableAmount = () => {
        const { payContract } = this.state
        let totalPayable = (parseFloat(payContract.insuranceAmt) + parseFloat(payContract.insuranceAmt * (payContract.insuranceTaxPerc / 100))) +
            (parseFloat(payContract.depositAmt) + parseFloat(payContract.depositAmt * (payContract.depositTaxPerc / 100))) +
            (parseFloat(payContract.connectionAmt) + parseFloat(payContract.connectionAmt * (payContract.connectionTaxPerc / 100))) +
            (parseFloat(payContract.maintainanceAmt) + parseFloat(payContract.maintainanceAmt * (payContract.maintainanceTaxPerc / 100))) +
            (parseFloat(payContract.disconnectionAmt) + parseFloat(payContract.disconnectionAmt * (payContract.disconnectionTaxPerc / 100))) +
            (parseFloat(payContract.registrationAmt) + parseFloat(payContract.registrationAmt * (payContract.registrationTaxPerc / 100))) +
            (parseFloat(payContract.other1Amt) + parseFloat(payContract.other1Amt * (payContract.other1TaxPerc / 100))) +
            (parseFloat(payContract.other2Amt) + parseFloat(payContract.other2Amt * (payContract.other2TaxPerc / 100))) +
            (parseFloat(payContract.other3Amt) + parseFloat(payContract.other3Amt * (payContract.other3TaxPerc / 100)))
        this.setState({
            showPayModal: true,
            payContractNumber: payContract.contractNo,
            payCompany: payContract.company,
            payAmount: totalPayable
        })
    }

    makePayment = async (type) => {
        let currentGasContract = this.state.payContract
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
                    "value": type == "VIP" ? Math.round((parseFloat(parseInt(this.state.payAmount) + 105)) * 100) : Math.round((parseFloat(parseInt(this.state.payAmount))) * 100)
                },
                "emailAddress": currentGasContract.email
            }

            let outLetReference = ""

            if (currentGasContract.company == "97") {
                outLetReference = abudhabiTestOutletReference
            } else if (currentGasContract.company == "91") {
                outLetReference = dubaiTestOutletReference
            } else if (currentGasContract.company == "92") {
                outLetReference = fujairahTestOutletReference
            } else if (currentGasContract.company == "01") {
                outLetReference = abudhabiOutletReference
            } else if (currentGasContract.company == "02") {
                outLetReference = dubaiOutletReference
            } else if (currentGasContract.company == "03") {
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
                                this.setState({
                                    apiCallFlags: { ...this.state.apiCallFlags, updateRequestInitialCalled: true }
                                }, () => {
                                    this.props.updateRequestInitial({
                                        "ID": this.state.currentTransaction.ID,
                                        "PAYMENT_STATUS": "PAID",
                                        "PAYMENT_TXN_ID": this.state.payContractRecReqBody.TRANSACTION_ID,
                                        "REMARKS": this.state.payType,
                                        "PREFERRED_DATE": this.state.payType == "VIP" ? this.state.date : "",
                                        "USER_ID": "1",
                                        "CONTRACT_RECEIPT_CREATED": false,
                                        "CONTRACT_RECEIPT_NO": ""
                                    })
                                })
                                let currentDate = new Date()
                                let reqBody = {
                                    "COMPANY": currentGasContract.company,
                                    "CONTRACT_NO": currentGasContract.contractNo,
                                    "YEARCODE": currentDate.getFullYear(),
                                    "DEVICE_ID": "12345",
                                    "DATE": this.formatDate(currentDate.toDateString()),
                                    "USER_ID": await AsyncStorage.getItem("sergas_customer_user_id"),
                                    "TRANSACTION_ID": createOrderRes.reference,
                                }

                                this.setState({
                                    apiCallFlags: { ...this.state.apiCallFlags, ...{ payContractRecApiCalled: true } },
                                    payContractRecReqBody: reqBody
                                }, () => {
                                    this.props.payContractRec(reqBody)
                                })
                            }
                        } catch (initiatePaymentErr) {
                            this.setState({ currentTransaction: null })
                            if (initiatePaymentErr.status == "Failed") {
                                this.toastIt("Payment Failed")
                            }
                            if (initiatePaymentErr.status == "Aborted") {
                                this.toastIt("Payment Aborted")
                            }
                        }
                    } else {
                        this.setState({ currentTransaction: null })
                        this.toastIt("Something went wrong. Try again later.")
                    }
                })
                .catch(createOrderErr => {
                    this.setState({ currentTransaction: null })
                    this.toastIt("Something went wrong. Try again later.")
                })
        } else {
            this.setState({ currentTransaction: null })
            this.toastIt("Something went wrong. Try again later.")
        }
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

    makeVipInvoiceReceipt = () => {
        let currDate = new Date().toLocaleDateString();
        let currentGasContract = this.state.payContract
        // this.toastIt("Payment Successful. It will be reflected in your account shortly.")
        let currentDate = new Date()
        let createRecReqBody = {
            "COMPANY": currentGasContract.COMPANY,
            "CONTRACT_NO": currentGasContract.CONTRACT_NO,
            "YEARCODE": currentDate.getFullYear(),
            "REC_DOC_TYPE": "GREC",
            "INV_NO": currentGasContract.LAST_INVDOCNO,
            "INV_DOCTYPE": "GINC",
            "INV_DATE": this.formatDate(currentDate.toDateString()),
            "INV_YEAR_CODE": currentDate.getFullYear(),
            "INV_AMT": "105",
            "REC_AMT": "105",
            "DATE": currDate,
            "USER_ID": "1",
            "DEVICE_ID": "12345"
        }


        let createInvReqBody = {
            "COMPANY": currentGasContract.COMPANY,
            "CONTRACT_NO": currentGasContract.CONTRACT_NO,
            "DEVICE_ID": "12345",
            "DATE": currDate,
            "AMOUNT": "100",
            "REMARKS": "VIP CONNECTION - MOBILE APP",
            "USER_ID": "1",
            "YEAR_CODE": currentDate.getFullYear(),
            "CHARGE_TYPE": "UDF",
            "CHARGE_DESCP": "VIP CONNECTION FEE",
            "YEARCODE": currentDate.getFullYear()
        }

        this.setState({
            createRecReqBody: createRecReqBody,
            apiCallFlags: { ...this.state.apiCallFlags, createCollectionInvoiceCalled: true }
        }, () => {
            this.props.createCollectionInvoice(createInvReqBody)
        })
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
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    <View style={{ ...Mainstyles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                        <View style={Mainstyles.headerLeft}>
                            <TouchableOpacity
                                style={Mainstyles.backbutton}
                                onPress={() => this.props.navigation.goBack()} >
                                <ArrowIcon direction={"left"} size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View style={Mainstyles.textContainer}>
                                <View style={Mainstyles.nameRow}>
                                    <Text style={Mainstyles.welcomeLabel} >
                                        My Requests
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/*  <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}> */}
                    <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ flexGrow: 1 }}>

                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_10 }}
                            style={{ flex: 1 }}
                            enabled
                            showsVerticalScrollIndicator={false}
                        >


                            <ScrollView
                                ref={(ref) => (this.scrollView = ref)}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollView}>

                                <View style={Mainstyles.bodyview}>


                                    {this.state.requests.length ? <>
                                    {/* <View style={{ ...styles.cardView, ...{ flexDirection: "row", minHeight: 0, width: "100%" } }}>
                                        <View style={{ width: "12%", justifyContent: "center" }}>
                                            <Text style={styles.colHeadeingText}>No.</Text>
                                        </View>
                                        <View style={{ width: "24%", justifyContent: "center" }}>
                                            <Text style={styles.colHeadeingText}>Date</Text>
                                        </View>

                                        <View style={{ width: "32%", justifyContent: "center", overflow: 'scroll' }}>
                                            <Text style={styles.colHeadeingText}>Type</Text>
                                        </View>
                                        <View style={{ width: "32%", justifyContent: "center" }}>
                                            <Text style={styles.colHeadeingText}>Status</Text>
                                        </View>
                                    </View> */}
                                    {this.state.requests.map((request, index) => {
                                        return <>
                                            <TouchableOpacity onPress={() => {
                                                this.setState({
                                                    currentTransaction: request
                                                })
                                            }}>
                                                {/* <View style={{ ...styles.cardView, ...{ flexDirection: "row", minHeight: 0, width: "100%", paddingVertical: 10 } }}>
                                                    <View style={{ width: "12%", justifyContent: "center" }}>
                                                        <Text style={styles.dataText}>{request.ID}</Text>
                                                    </View>
                                                    <View style={{ width: "24%", justifyContent: "center" }}>
                                                        <Text style={styles.dataText}>{request.DATE.split(" ")[0]}</Text>
                                                    </View>
                                                   
                                                    <View style={{ width: "32%", justifyContent: "center" }}>
                                                        <Text style={styles.dataText}>{request.REQUEST_TYPE == "NEW_CONNECTION" ? "CONNECTION" : request.REQUEST_TYPE}</Text>
                                                    </View>
                                                    <View style={{ width: "32%", justifyContent: "center", alignContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.dataText}>
                                                            {request.CONNECTION_STATUS != "" ? (request.CONNECTION_STATUS == "NEW_REQUEST" ? "REQUESTED" : request.CONNECTION_STATUS) : request.DISCONNECTION_STATUS}
                                                        </Text>
                                                        {
                                                            request.CONNECTION_STATUS == "APPROVED" ?
                                                                <TouchableOpacity
                                                                    style={styles.payBillView}
                                                                    onPress={() => {
                                                                        this.setState({ currentTransaction: request })
                                                                        this.handlePay(request.CONTRACT_NO, request.COMPANY)
                                                                    }}
                                                                >
                                                                    {
                                                                        this.state.currentTransaction == request ?
                                                                            <ActivityIndicator size='small' color='black' /> :
                                                                            <>
                                                                                <Text style={styles.payBillText}>Pay</Text>
                                                                                <Image
                                                                                    source={require('../../../assets/images/ClickNew.png')}
                                                                                    style={styles.clickImage}
                                                                                />
                                                                            </>
                                                                    }
                                                                </TouchableOpacity> :
                                                                null
                                                        }
                                                    </View>


                                                </View> */}

                                                <View style={styles.headerView}>
                                                    <View style={styles.headerLeft}>

                                                        <View style={styles.textContainer}>
                                                            <View style={styles.nameRow}>
                                                                <Text style={styles.welcomeText}>Request Details</Text>
                                                            </View>

                                                            <TouchableOpacity >
                                                                <Text style={styles.welcomeSu400bText}>Request No. #{request.ID}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View>

                                                            <TouchableOpacity style={styles.watchVideoButton} >
                                                                <View>
                                                                    <Text style={styles.watchVideoButtonText}>{request.CONNECTION_STATUS != "" ? (request.CONNECTION_STATUS == "NEW_REQUEST" ? "REQUESTED" : request.CONNECTION_STATUS) : request.DISCONNECTION_STATUS}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>
                                                </View>
                                                <View style={styles.containerDetails}>
                                                    <Text style={styles.containerDetailstext}>{request.REQUEST_TYPE == "NEW_CONNECTION" ? "CONNECTION" : request.REQUEST_TYPE}</Text>
                                                </View>
                                            </TouchableOpacity>



                                        </>
                                    })}</> : this.state.apiCallFlags.getRequestsCalled ? <ActivityIndicator size={"small"} color={"black"} /> :
                                        <View style={{ alignItems: "center" }}>
                                            {/* <Text style={Mainstyles.accountsLabel}>No Requests Found</Text> */}
                                            <Image source={require('../../../assets/images/request.png')} />
                                            <Text style={styles.RequestLabelHead}>You don’t have any requests yet!</Text>
                                            <Text style={styles.RequestLabel}>Check back later to see your requests here.</Text>
                                            <TouchableOpacity
                                                style={{ ...styles.buttonStyle, width: "100%" }}
                                                onPress={() => this.props.navigation.goBack()} >
                                                <Text
                                                    style={styles.RequestButton}>Back to Home</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                                {/* {this.state.howTo.map(data => {
                            return <TouchableOpacity 
                            style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                            onPress={() => this.props.navigation.navigate("HelpAnswer", { "helpData": data})}
                            >
                            <View style={styles.optionIconViewCol2}>
                                    <Text style={styles.accountNumberText}>{data.que}</Text>
                            </View>
                        </TouchableOpacity>
                        })} */}

                            </ScrollView>
                            {this.state.showPayModal ? (
                                <Modal
                                    onClose={() => this.setState({ showPayModal: false, currentTransaction: null })}
                                    visible={this.state.showPayModal}
                                    button1={true}
                                    onButton1={() => {
                                        this.makePayment(this.state.payType)
                                        this.setState({ showPayModal: false })
                                    }}
                                    button2={true}
                                    onButton2={() => {
                                        this.setState({ showPayModal: false, currentTransaction: null })
                                    }}
                                    data={{
                                        title: "Test",
                                        // message: `Contract No: ${this.state.payContract.CONTRACT_NO}\nName: ${this.state.payContract.PARTYNAME}\nPay Amount: ${this.state.payContract.OUTSTANDING_AMT} AED`,
                                        button1Text: "Pay",
                                        button2Text: "Cancel",
                                        view: <View style={{ marginTop: -20 }}>
                                            <View style={{ marginBottom: 0 }}>
                                                {this.state.payType == "VIP" ?
                                                    <View style={styles.inputGroupStyle}>
                                                        <View>
                                                            <Text style={styles.inputLabelStyle}>{t("myLinks.preferredDateAndTime")}</Text>
                                                        </View>
                                                        <View>
                                                            <DatePicker
                                                                mode="date"
                                                                minimumDate={new Date(new Date().getTime() + (2 * 86400000))}
                                                                minuteInterval={30}
                                                                date={this.state.date}
                                                                onDateChange={(date) => {
                                                                    this.setState({
                                                                        date: date
                                                                    })
                                                                }} />
                                                        </View>
                                                    </View>
                                                    : null}

                                                <View style={{ ...styles.paymentDueRow1, flexDirection: 'row', marginBottom: 10 }}>

                                                    <TouchableOpacity
                                                        style={styles.payBillView}
                                                        // onPress={this.handleSubmit}
                                                        onPress={() => {
                                                            { this.state.payType == "VIP" ? this.setState({ payType: "NON_VIP" }) : this.setState({ payType: "VIP" }) }

                                                            // this.makePayment("NON_VIP")
                                                        }}
                                                    // onPress={() => this.setState({showTermsModal: !this.state.showTermsModal})}
                                                    >
                                                        <Text style={styles.registerHereText}>
                                                            Click here
                                                        </Text>
                                                        {/* <Image
                                                    source={require('../../../assets/images/click.png')}
                                                    style={styles.clickImage}
                                                /> */}
                                                    </TouchableOpacity>
                                                    <Text
                                                        style={styles.notCustomerText}> {this.state.payType == "VIP" ? " for regular connection" : " to set your preferred connection date"}
                                                    </Text>
                                                </View>

                                                {/* <View style={styles.notCustomerView}>
                                            <TouchableOpacity
                                                style={styles.payBillView}
                                                // onPress={this.handleSubmit}
                                                onPress={() => {
                                                    this.setState({payType: "NON_VIP", showPayModal: false})
                                                    this.makePayment("NON_VIP")}}
                                            // onPress={() => this.setState({showTermsModal: !this.state.showTermsModal})}
                                            >
                                                <Text style={styles.registerHereText}>
                                                    Click here
                                                </Text>
                                                <Image
                                                    source={require('../../../assets/images/click.png')}
                                                    style={styles.clickImage}
                                                />
                                            </TouchableOpacity>
                                        </View> */}

                                                <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                    <Text style={{ ...styles.accountNumberText, color: "rgba(134, 120, 120, 1)" }}>Contract No: <Text style={styles.accountNumberText}>{this.state.payContractNumber}</Text></Text>
                                                    {/* <Text>Name: {this.state.payContract.PARTYNAME}</Text> */}
                                                    <Text style={{ ...styles.accountNumberText, color: "rgba(134, 120, 120, 1)" }}>Pay Amount: <Text style={styles.accountNumberText}>{this.state.payAmount} AED</Text></Text>
                                                    {this.state.payType == "VIP" ? <Text>
                                                        <Text style={{ ...styles.accountNumberText, color: "rgba(134, 120, 120, 1)" }}>Scheduled Connection Charge: <Text style={styles.accountNumberText}>105 AED</Text></Text>
                                                        {/* <Text style={{ ...styles.accountNumberText, color: "rgba(134, 120, 120, 1)" }}>Total Amount: <Text style={styles.accountNumberText}>{this.state.payAmount + 105} AED</Text></Text> */}
                                                    </Text> :
                                                        null}
                                                    <Text style={{ ...styles.accountNumberText, color: "rgba(134, 120, 120, 1)" }}>Total Amount: <Text style={styles.accountNumberText}>
                                                        {this.state.payType == "VIP" ? (this.state.payAmount + 105) : this.state.payAmount} AED
                                                    </Text></Text>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                                {/* </View> */}

                                            </View>
                                        </View>
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
                            ) : null}
                            {this.state.currentTransaction != null ? (
                                <Modal
                                    close={!this.state.apiCallFlags.updateRequestCalled}
                                    onClose={() => this.setState({ currentTransaction: null, cancelRequest: false })}
                                    visible={this.state.currentTransaction != null}
                                    button1={this.state.cancelRequest && !this.state.apiCallFlags.updateRequestCalled}
                                    onButton1={() => {
                                        this.setState({
                                            apiCallFlags: { ...this.state.apiCallFlags, updateRequestCalled: true }
                                        }, async () => {
                                            this.props.updateRequest({
                                                "ID": this.state.currentTransaction.ID,
                                                "REMARKS": await AsyncStorage.getItem("sergas_customer_mobile_number"),
                                                "USER_ID": this.state.currentTransaction.USER_ID,
                                                "CONNECTION_STATUS": "CANCELLED"
                                            })
                                        })
                                    }}
                                    button2={this.state.cancelRequest && !this.state.apiCallFlags.updateRequestCalled}
                                    onButton2={() => {
                                        this.setState({ cancelRequest: false })
                                    }}
                                    data={{
                                        title: "Request Details",
                                        button1Text: "Yes",
                                        button2Text: "No",
                                        view:
                                            this.state.currentTransaction.REQUEST_TYPE == "NEW_CONNECTION" ?
                                                <View style={{ marginTop: -10 }}>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Request No.:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.ID}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Request Type:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>NEW CONNECTION</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Emirates ID:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.EID}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Building Code:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.BUILDING_CODE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Apartment Code:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.APARTMENT_CODE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Emirate:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.EMIRATE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Requested on:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.DATE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Created Account:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.CONTRACT_NO}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Connection Status:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.CONNECTION_STATUS}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Payment Status:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.PAYMENT_STATUS}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Paid Amount:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.AMOUNT} AED</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Transaction No.:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.PAYMENT_TXN_ID}</Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        this.state.currentTransaction.COMMENTS == "VIP" ?
                                                            <View style={styles.cardBodyRow}>
                                                                <View style={styles.cardBodyColumnLeft}>
                                                                    <Text style={styles.cardBodyText}>Preferred Date for Connection:</Text>
                                                                </View>
                                                                <View style={styles.cardBodyColumnRight}>
                                                                    <Text style={styles.cardBodyText1}>{new Date(this.state.currentTransaction.PREFERRED_DATE_TIME).toLocaleDateString()}</Text>
                                                                </View>
                                                            </View> : null
                                                    }
                                                </View> : <View style={{ marginTop: -10 }}>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Request No.:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.ID}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Request Type:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>Disconnection</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Requested on:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.DATE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Emirates ID:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.EID}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Building Code:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.BUILDING_CODE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Apartment Code:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.APARTMENT_CODE}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Account No.:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.CONTRACT_NO}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.cardBodyRow}>
                                                        <View style={styles.cardBodyColumnLeft}>
                                                            <Text style={styles.cardBodyText}>Request Status:</Text>
                                                        </View>
                                                        <View style={styles.cardBodyColumnRight}>
                                                            <Text style={styles.cardBodyText1}>{this.state.currentTransaction.CONNECTION_STATUS}</Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        this.state.currentTransaction.COMMENTS == "VIP" ?
                                                            <View>
                                                                <View style={styles.cardBodyRow}>
                                                                    <View style={styles.cardBodyColumnLeft}>
                                                                        <Text style={styles.cardBodyText}>Preferred Date for Connection:</Text>
                                                                    </View>
                                                                    <View style={styles.cardBodyColumnRight}>
                                                                        <Text style={styles.cardBodyText1}>{new Date(this.state.currentTransaction.PREFERRED_DATE_TIME).toLocaleDateString()}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.cardBodyRow}>
                                                                    <View style={styles.cardBodyColumnLeft}>
                                                                        <Text style={styles.cardBodyText}>Payment Status:</Text>
                                                                    </View>
                                                                    <View style={styles.cardBodyColumnRight}>
                                                                        <Text style={styles.cardBodyText1}>{this.state.currentTransaction.PAYMENT_STATUS}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.cardBodyRow}>
                                                                    <View style={styles.cardBodyColumnLeft}>
                                                                        <Text style={styles.cardBodyText}>Transaction No.:</Text>
                                                                    </View>
                                                                    <View style={styles.cardBodyColumnRight}>
                                                                        <Text style={styles.cardBodyText1}>{this.state.currentTransaction.PAYMENT_TXN_ID}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            : null
                                                    }
                                                    {
                                                        this.state.apiCallFlags.updateRequestCalled ? <ActivityIndicator size={"small"} color={"black"} /> : (this.state.currentTransaction.CONNECTION_STATUS == "REQUESTED") && (this.state.currentTransaction.COMMENTS != "VIP") ?
                                                            this.state.cancelRequest ?
                                                                <View style={{ width: "95%" }}>
                                                                    <Text style={{ ...styles.cardBodyText1, fontSize: 16 }}>Are you sure you want to cancel the disconnection request?</Text>
                                                                </View>
                                                                :
                                                                <TouchableOpacity
                                                                    style={{ ...styles.buttonStyle, width: "100%" }}
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            cancelRequest: true
                                                                        })
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={styles.buttonLabelStyle}>Cancel Request</Text>
                                                                </TouchableOpacity> : null
                                                    }

                                                </View>
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                />
                            ) : null}
                            {this.state.showToast ? (
                                <Toast message={this.state.toastMessage} isImageShow={false} />
                            ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(MyRequests, {
    methods: {
        getMyRequests: {
            type: 'post',
            moduleName: 'api',
            url: 'getMyRequests',
            authenticate: true,
        },
        singleContractDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getConnectionFeeDetails',
            authenticate: true,
        },
        payContractRec: {
            type: 'post',
            moduleName: 'api',
            url: 'payContractReceipt',
            authenticate: true,
        },
        updateRequest: {
            type: "post",
            moduleName: "api",
            url: "updateConnectionRequestSts",
            authenticate: true,
        },
        updateRequestInitial: {
            type: "post",
            moduleName: "api",
            url: "updateConnectionRequestSts",
            authenticate: true,
        },
        getAllContracts: {
            type: 'get',
            moduleName: 'api',// 'goodiee-cataloguecore',
            url: 'getContractsByMobile',
            authenticate: false,
        },
        createCollectionInvoice: {
            type: 'post',
            moduleName: 'api',
            url: 'createCollectionInvoice',
            authenticate: true,
        },
        createInvoiceReceipt: {
            type: 'post',
            moduleName: 'api',
            url: 'createInvoiceReceipt',
            authenticate: true,
        },
    }
})
)



