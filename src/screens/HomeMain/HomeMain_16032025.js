
import styles from './HomeMainStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, BackHandler, ImageBackground, Alert, Linking } from 'react-native'
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
import { connect } from 'react-redux';
import { updateContracts } from '../../stores/actions/contracts.action';
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
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { updateUserDetails } from '../../stores/actions/user.action';
import { API_PATH } from '../../services/api/data/data/api-utils';


class HomeMain extends Component {
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
            makePaymentClicked: false,
            getUserDetailsCalled: false
        }
        this.scrollView = React.createRef()
    }

    // ,{
    //     "COMPANY": "90",
    //     "YEARCODE": "2021",
    //     "CONTRACT_NO": "G33022",
    //     "DOCTYPE": "GCT",
    //     "CONNECTION_DATE": "11/1/2017 12:00:00 AM",
    //     "PARTYCODE": "G33010",
    //     "PARTYNAME": "Mr. Aftab Mahmud Khan ",
    //     "BUILDING_CODE": "B316",
    //     "APARTMENT_CODE": "333",
    //     "UNIT_PRICE": 19.85,
    //     "LAST_READING": 777.87,
    //     "LAST_READING_DATE": "10/31/2021 12:00:00 AM",
    //     "PREVIOUS_READING": 666.971,
    //     "PREVIOUS_READING_DATE": "7/14/2021 12:00:00 AM",
    //     "LAST_INVNETAMT": "555.220",
    //     "AMT": 0,
    //     "LAST_INVDOCNO": "GIN001970",
    //     "LAST_INVDOCTYPE": "GINV",
    //     "LAST_YEARCODE": "2021",
    //     "LAST_INVDATE": "10/31/2021 12:00:00 AM",
    //     "FINAL_INVOICE_YN": "",
    //     "MOBILE": "971558019716",
    //     "EMAIL": "arkhan86@gmail.com",
    //     "OUTSTANDING_AMT": 0,
    //     "EID": null,
    //     "BUILDING_NAME": "MOHD. ALI NASIR AL NUWAIS BLDG",
    //     "USER_ID": "101025"
    // }
    async componentWillMount() {
        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({ contractList: this.props.contracts,
            getUserDetailsCalled: true }, async () => {
                this.props.getUserDetails({ "mobile": await AsyncStorage.getItem('sergas_customer_mobile_number') })
            })
        this.props.updateContracts(JSON.parse(contracts))
        // this.props.updateContracts([])
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            // return true
            Alert.alert(
                'Exit App',
                'Exiting the application?', [{
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => BackHandler.exitApp()
                },], {
                cancelable: false
            }
            )
            return true;
        });
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        this.setState({
            apiCallFlags: { ...this.state.apiCallFlags,getAllContractsCalled: true  }
        }, async () => {
            this.props.getAllContracts({
                // MobileNumber: await AsyncStorage.getItem("sergas_customer_mobile_number")
                MobileNumber: await AsyncStorage.getItem('sergas_customer_mobile_number')
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        const { updatePaymentResult, getAllContractsResult, getUserDetailsResult } = nextProps
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

        if (this.state.apiCallFlags.getAllContractsCalled && getAllContractsResult) {
            this.setState({
                apiCallFlags: { ...this.state.apiCallFlags, ...{ getAllContractsCalled: false } },
                getUserDetailsCalled: true
            }, async () => {
                this.props.getUserDetails({ "mobile": await AsyncStorage.getItem('sergas_customer_mobile_number') })
                if (getAllContractsResult && getAllContractsResult.content && getAllContractsResult.content.STATUS == "SUCCESS") {
                    await AsyncStorage.setItem(
                        'contract_list',
                        JSON.stringify(getAllContractsResult.content.DETAIL)
                    )
                    this.props.updateContracts(getAllContractsResult.content.DETAIL)
                    this.setState({
                        contractList: getAllContractsResult.content.DETAIL
                    })
                    this.getAuthenticationToken(await AsyncStorage.getItem('sergas_customer_mobile_number'))
                    //   setTimeout(() => {
                    //     this.forceUpdate();
                    //   }, 5000)
                }
            })

        }

        if (this.state.getUserDetailsCalled && getUserDetailsResult && getUserDetailsResult.content) {
            this.setState({
                getUserDetailsCalled: false
            }, () => {
                if (getUserDetailsResult && getUserDetailsResult.content && getUserDetailsResult.content.USER_ID) {
                    this.props.updateUserDetails(getUserDetailsResult.content)
                } else {
      
                }
            })
        }
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
        // BackHandler.removeEventListener('hardwareBackPress', () => BackHandler.exitApp());
    }

    getAuthenticationToken = (mobileNumber) => {

        var details = {
            'userName': mobileNumber + "@mobapp.com",
            'Password': 'Test@123',
            'grant_type': 'password'
        }

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch(API_PATH + "/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
            .then(res => {
                return res.json()
            }).then(async resData => {
                if (resData && resData.access_token) {
                    await AsyncStorage.setItem(
                        'sergas_customer_access_token',
                        resData.access_token,)
                } else {
                    // this.setState({
                    //   showToast: true,
                    //   toastMessage: "Something went wrong, Please try again later",
                    // });
                    // setTimeout(() => {
                    //   this.setState({ showToast: false, toastMessage: "" });
                    // }, 5000);
                }
            })
            .catch(err => {})
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

    handlePayBill = () => {
        this.props.navigation.navigate("Payment")
    }

    handleRequestNewConnection = () => {
        this.props.navigation.navigate("reqNewConn")
    }

    carouselCurrentItem = (currentItemIndex) => {
        this.setState({ activeItemIndex: currentItemIndex })
    }

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
        let totalAmt = 0;
        if ((this.props.contracts !== null) && this.props.contracts.length) {
            this.props.contracts.map(contract => {
                if (contract.OUTSTANDING_AMT > 0) {
                    totalAmt = totalAmt + contract.OUTSTANDING_AMT
                }
            })
        }
        return (
            <ImageBackground 
      source={require('../../assets/images/cover.png')} // Ensure the path is correct
      style={{ flex: 1, width: '100%', height: '100%' }} // Inline styles
      resizeMode="cover"
    >
            <SafeAreaView style={{ height: "100%", flex: 1 }} >
            
                {/* <ButtonLogoView
                    hideBackButton={true}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}
                        yourRequests={true}
                        navigation={this.props.navigation}
                    ></ButtonLogoView> */}
                <View style={{ ...styles.headerView, height: Dimensions.HP_20 }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={styles.headerCol1}>
                            <Image
                            resizeMode='contain'
                                source={require("../../../assets/images/logo2.png")}
                                style={styles.goodieeLogoImage} />
                            <View style={{ flexDirection: 'column', width: "75%" }}>
                                <Text style={styles.welcomeLabel} >
                                    {t("home.hiUser")} - Enayat tttqq
                                </Text>
                                <Text style={styles.userNameLabel} >
                                    {(this.props.userDetails.PARTY_NAME ? this.props.userDetails.PARTY_NAME : this.props.contracts.length ? this.props.contracts[this.state.activeItemIndex].PARTYNAME : null)}
                                </Text>
                            </View>
                            
                            {/* <Image
                                    style={{
                                        height: 17.69
                                    }}
                                    source={require("../../../assets/images/notification.png")}
                                /> */}
                            {/* <ImageBackground
                        source={require("../../../assets/images/loading.gif")}
                        style={{ width: 30, height: 30}}
                      /> */}
                        </View>
                    </View>
                     {/* Info Banner */}
                     
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Pay Your Gas Bills. Monitor Your Gas Usage. Manage Your Gas Service.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Support</Text>
        </TouchableOpacity>
      </View>
                    <View style={{ ...styles.accountsLabelView, ...{ alignSelf: 'center', width: "100%" } }}>

                    </View>
                </View>
                {/* <ImageBackground source={Images.TransparentBackground} style={{ height: Dimensions.HP_100, width: Dimensions.WP_100 ,}} resizeMode={'cover'}> */}
                {/* <CustomText style={{ color: Colors.DarkBlue, fontFamily: Fonts.Medium, marginTop: 20,marginRight: 30, alignSelf: 'flex-end' }} onPress={() => {
                                    this.props.navigation.navigate("SpotlightList")
                                }}>Go to your requests</CustomText> */}

                {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
                <View style={{
                    height: Platform.OS == 'ios' ? "90%" : "100%", backgroundColor: "#FFFFFF", overflow: 'hidden',
                    borderTopLeftRadius: 24, 
                    borderTopRightRadius: 24,
                    width: '100%'
                }} >
                    <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                        // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_19 }}
                        style={{ flex: 1, paddingBottom: 60 }}
                        enabled
                        showsVerticalScrollIndicator={false}
                    >
                        <ScrollView
                            ref={(ref) => (this.scrollView = ref)}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollView}>
                            {this.props.contracts.length ?
                                (
                                    <>
                                        {/* <View style={{ ...styles.cardView, ...{ height: 61, paddingTop: 5, marginBottom: 15 } }} >
                                        <View style={styles.paymentDueRow1}>
                                            <Text style={styles.accountNumberText}>{t("home.paymentDueUpto")}</Text>
                                        </View>
                                        <View style={styles.paymentDueRow2}>
                                            <View style={styles.amountView}>
                                                <Text style={styles.amountText}>{totalAmt}</Text>
                                                <Text style={styles.aedText}>{t("home.aed")}</Text>
                                            </View>
                                //              <TouchableOpacity
                                //     style={styles.payBillView}
                                //     onPress={this.handlePayBill}
                                // >
                                //     <Text style={styles.payBillText}>{t("home.payBill")}</Text>
                                //     <Image
                                //         source={require('../../../assets/images/click.png')}
                                //         style={styles.clickImage}
                                //     />
                                // </TouchableOpacity>
                                        </View>
                                    </View> */}
                                        <View style={styles.accountsLabelView}>
                                            <Text style={styles.accountsLabel} >
                                                {t("home.accounts")}
                                            </Text>
                                        </View>
                                        <HomeMainCard
                                            contracts={this.props.contracts}
                                            from="home"
                                            usageCharges={1234}
                                            userName="User NameX"
                                            accountNumber="YYYY XXXX YYYY XXXX"
                                            currentIndex={this.carouselCurrentItem}
                                            handleMoreServices={this.handlePayBill}
                                            handlePayBill={this.makePayment}
                                            loading={this.state.makePaymentClicked}
                                        />



                                    </>
                                ) : null }
                                <>
                                    <View style={styles.accountsLabelView}>
                                        <Text style={styles.accountsLabel} >
                                            Services
                                        </Text>
                                    </View>
                                    <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>
                                        <TouchableOpacity style={styles.homeOption}
                                        // <TouchableOpacity style={{...styles.homeOption,opacity: this.props.contracts.length ? 1 : 0.5}}
                                            onPress={() => {
                                                if (this.props.contracts.length) {
                                                    this.props.navigation.navigate("submitReading")
                                                } else {
                                                    this.toastIt("No Contract Available")
                                                }
                                            }}
                                        >

                                            <Image
                                                source={require('../../../assets/images/SelfMeterReadingHome1.png')}
                                                style={{...styles.homeOptionIcon, opacity: this.props.contracts.length ? 1 : 0.5}}
                                            />
                                            <Text style={{...styles.homeoptionText, opacity: this.props.contracts.length ? 1 : 0.5}}>Meter Reading</Text>
                                        </TouchableOpacity>
                                        

                                        <TouchableOpacity style={styles.homeOption}
                                            onPress={this.handleRequestNewConnection}>

                                            <Image
                                                source={require('../../../assets/images/NewConnectionHome1.png')}
                                                style={styles.homeOptionIcon}
                                            />
                                            <Text style={styles.homeoptionText}>New Connection</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.homeOption}
                                        // <TouchableOpacity style={{...styles.homeOption,opacity: this.props.contracts.length ? 1 : 0.5}}
                                            onPress={() => { 
                                            if (this.props.contracts.length) {
                                                this.props.navigation.navigate("disconnection")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                             }}>

                                            <Image
                                                source={require('../../../assets/images/DisconnectionHome1.png')}
                                                style={{...styles.homeOptionIcon, opacity: this.props.contracts.length ? 1 : 0.5}}
                                            />
                                            <Text style={{...styles.homeoptionText, opacity: this.props.contracts.length ? 1 : 0.5}}>Disconnection</Text>
                                        </TouchableOpacity>

                                    </ScrollView>

                                    <View style={styles.accountsLabelView}>
                                        <Text style={styles.accountsLabel} >
                                            Payment
                                        </Text>
                                    </View>
                                    <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>

                                    <TouchableOpacity style={styles.homeOption}
                                    // <TouchableOpacity style={{...styles.homeOption,opacity: this.props.contracts.length ? 1 : 0.5}}
                                            onPress={() => {
                                                if (this.props.contracts.length) {
                                                    this.props.navigation.navigate("Payment")
                                                } else {
                                                    this.toastIt("No Contract Available")
                                                }
                                                }}>

                                            <Image
                                                source={require('../../../assets/images/MakePaymentHome1.png')}
                                                style={{...styles.homeOptionIcon, opacity: this.props.contracts.length ? 1 : 0.5}}
                                            />
                                            <Text style={{...styles.homeoptionText, opacity: this.props.contracts.length ? 1 : 0.5}}>Make Payment</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.homeOption}
                                        // <TouchableOpacity style={{...styles.homeOption,opacity: this.props.contracts.length ? 1 : 0.5}}
                                            onPress={() => {
                                                if (this.props.contracts.length) {
                                                    this.props.navigation.navigate("statement")
                                                } else {
                                                    this.toastIt("No Contract Available")
                                                }
                                                }}>

                                            <Image
                                                source={require('../../../assets/images/StatementHome1.png')}
                                                style={{...styles.homeOptionIcon, opacity: this.props.contracts.length ? 1 : 0.5}}
                                            />
                                            <Text style={{...styles.homeoptionText, opacity: this.props.contracts.length ? 1 : 0.5}}>Statement</Text>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity style={styles.homeOption}
                                            onPress={() => {
                                                if (this.props.contracts.length) {
                                                    this.toastIt("Saved Cards will be available Soon")
                                                } else {
                                                    this.toastIt("No Contract Available")
                                                }
                                                }}>

                                            <Image
                                                source={require('../../../assets/images/SavedCardsHome1.png')}
                                                style={styles.homeOptionIcon}
                                            />
                                            <Text style={styles.homeoptionText}>Saved Cards</Text>
                                        </TouchableOpacity> */}
                                    </ScrollView>

                                    <View style={styles.accountsLabelView}>
                                        <Text style={styles.accountsLabel} >
                                            Support
                                        </Text>
                                    </View>
                                    <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>

                                        <TouchableOpacity style={styles.homeOption}
                                            onPress={() => Linking.openURL(`tel:600565657`)}>

                                            <Image
                                                source={require('../../../assets/images/EmergencyHome1.png')}
                                                style={styles.homeOptionIcon}
                                            />
                                            <Text style={styles.homeoptionText}>Emergency</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.homeOption}
                                        // <TouchableOpacity style={{...styles.homeOption,opacity: this.props.contracts.length ? 1 : 0.5}}
                                            onPress={() => {this.props.navigation.navigate("raiseComplaint")}}>

                                            <Image
                                                source={require('../../../assets/images/CustomerCareHome1.png')}
                                                style={styles.homeOptionIcon}
                                            />
                                            <Text style={styles.homeoptionText}>Customer Care</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.homeOption}
                                            onPress={() => { this.props.navigation.navigate("feedback") }}>

                                            <Image
                                                source={require('../../../assets/images/FeedbackHome1.png')}
                                                style={styles.homeOptionIcon}
                                            />
                                            <Text style={styles.homeoptionText}>Feedback</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                    {
                                        !(Platform.OS == 'ios' && Platform.isPad) ?
                                        <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>
                                        <TouchableOpacity style={styles.homeOption}
                                            onPress={() => { this.props.navigation.navigate("HelpMain") }}>

                                            <Image
                                                source={require('../../../assets/images/SafetyHome1.png')}
                                                style={styles.homeOptionIcon}
                                            />
                                            <Text style={styles.homeoptionText}>Safety Tips</Text>
                                        </TouchableOpacity>
                                    </ScrollView> : null
                                    }
                                    

                                    {/* <View style={{ ...styles.cardView, ...{ minHeight: "auto" } }} >
                                        <View style={styles.paymentDueRow1}>
                                            <Text style={styles.accountNumberText}>{t("home.wantConnection")}</Text>
                                        </View>
                                        <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }} onPress={this.handleRequestNewConnection}>
                                            <Text style={styles.payBillText}>{t("home.requestNewConnection")}</Text>
                                            <Image
                                                source={require('../../../assets/images/click.png')}
                                                style={styles.clickImage}
                                            />
                                        </TouchableOpacity>
                                    </View> */}
                                </>


                            {/* { this.props.contracts.length ? (<View style={styles.cardView} >
                            <View style={styles.paymentDueRow1}>
                                <Text style={styles.notCustomerText}>{t("home.meterReading")}</Text>
                            </View>
                            <View style={styles.paymentDueRow1}>
                                <Text style={styles.accountNumberText}>{t("home.updateRadingYourself")}</Text>
                            </View>
                            <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                onPress={() => this.props.navigation.navigate("submitReading")}
                            >
                                <Text style={styles.payBillText}>{t("home.submitMeterReading")}</Text>
                                <Image
                                    source={require('../../../assets/images/click.png')}
                                    style={styles.clickImage}
                                />
                            </TouchableOpacity>
                        </View>) : null}

                        <View style={{ ...styles.cardView, ...{ minHeight: "auto" } }} >
                            <View style={styles.paymentDueRow1}>
                                <Text style={styles.accountNumberText}>{t("home.wantConnection")}</Text>
                            </View>
                            <TouchableOpacity style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }} onPress={this.handleRequestNewConnection}>
                                <Text style={styles.payBillText}>{t("home.requestNewConnection")}</Text>
                                <Image
                                    source={require('../../../assets/images/click.png')}
                                    style={styles.clickImage}
                                />
                            </TouchableOpacity>
                        </View> */}
                        </ScrollView>
                    </KeyboardAwareScrollView>
                        </View>
                        {this.state.showToast ? (
                            <Toast message={this.state.toastMessage} isImageShow={false} />
                        ) : null}
                {/* </InfoContainer> */}
                {/* </ImageBackground> */}
            </SafeAreaView>
            </ImageBackground>
        )
    }

}

const mapStateToProps = ({ contractsReducer,userReducer }) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(HomeMain, {
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
        getUserDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getMobileUserDetails',
            authenticate: true,
        },
    }
})
)



