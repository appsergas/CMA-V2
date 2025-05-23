
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
// import NotificationIcon from '../../../assets/icons/NotificationIcon'
// import CheckIcon from '../../../assets/icons/CheckIcon'
import { NotificationIcon, CheckIcon, MeterIcon, NewConIcon, DisConIcon, CustomerCareIcon, EmergencyIcon, StatementIcon, MakePaymentIcon, FeedBackIcon, SafetyTipsIcon } from '../../../assets/icons'


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

import { Notifications } from 'react-native-notifications';

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
            getUserDetailsCalled: false,
            selectedTab: 'all',
        }
        this.scrollView = React.createRef()
    }


    async componentWillMount() {
        let contracts = await AsyncStorage.getItem("contract_list")
        this.setState({
            contractList: this.props.contracts,
            getUserDetailsCalled: true
        }, async () => {
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
                    onPress: () => { },
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
            apiCallFlags: { ...this.state.apiCallFlags, getAllContractsCalled: true }
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
                    console.log("getAllContractsResult.content.DETAIL", getAllContractsResult.content.DETAIL)
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
            .catch(err => { })
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
    handleNotification = () => {
        this.props.navigation.navigate("notification")
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


    handleTabNavigation = (index) => {
        this.setState({ activeItemIndex: index });
    };


    setTab = (tabName) => {
        this.setState({ selectedTab: tabName });
    };

    truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    getInitials = () => {
        const fullName = this.props.userDetails?.PARTY_NAME || '';
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

// handleNotification = () => {
//   Notifications.postLocalNotification({
//     title: "New Alert",
//     body: "You have a new in-app notification",
//     sound: "default",
//     silent: false,
//     userInfo: {
//       screen: "NotificationDetail",
//       title: "New Alert",
//       body: "You have a new in-app notification",
//     },
//   });
// };

    render() {
        let totalAmt = 0;
        if ((this.props.contracts !== null) && this.props.contracts.length) {
            this.props.contracts.map(contract => {
                if (contract.OUTSTANDING_AMT > 0) {
                    totalAmt = totalAmt + contract.OUTSTANDING_AMT
                }
            })
        }
        const { selectedTab } = this.state;
        const { contracts } = this.props;

        return (
            <ImageBackground
                source={require('../../assets/images/cover.png')}
                style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode="cover"
            >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    <View style={{ ...styles.headerView }}>
                        <View style={styles.headerLeft}>
                           <View style={styles.profileImageContainer}>
                                                {this.props.userDetails.image ? (
                                                    <Image
                                                        source={{ uri: `data:image/jpeg;base64,${this.props.userDetails.image}` }}
                                                        style={styles.profileImage}
                                                    />
                                                ) : (
                                                    <View style={[styles.profileImage, styles.initialsContainer]}>
                                                        <Text style={styles.initialsText}>
                                                            {this.getInitials(
                                                                this.props.userDetails.firstName,
                                                                this.props.userDetails.lastName
                                                            )}
                                                        </Text>
                                                    </View>
                                                )}

                                            </View>
                            <View style={styles.textContainer}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.welcomeText}>Hi,
                                        {
                                            this.props.userDetails.PARTY_NAME
                                                ? this.truncateText(this.props.userDetails.PARTY_NAME, 15)
                                                : this.props.contracts.length
                                                    ? this.truncateText(this.props.contracts[this.state.activeItemIndex].PARTYNAME, 15)
                                                    : null
                                        }
                                    </Text>
                                    <CheckIcon size={18} color="#4A90E2" style={styles.verifiedIcon} />
                                </View>
                                <Text style={styles.welcomeSubText}>Welcome Back</Text>
                            </View>
                        </View>

                        {/* Right Section - Notification Icon */}
                        <TouchableOpacity style={styles.notificationContainer} onPress={this.handleNotification}>
                            <NotificationIcon size={24} color="#000" />
                            {/* Red Dot for New Notifications */}
                            {this.state.hasNotifications && <View style={styles.notificationDot} />}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.banner}>
                        <Text style={styles.bannerText}>
                            Pay Your Gas Bills, Monitor Your Gas Usage, Manage Your Gas Service.
                        </Text>
                    </View>


                    <View>
                        <View style={styles.tabWrapper}>
                            <TouchableOpacity
                                style={[styles.firstTab, selectedTab === 'all' && styles.tabActiveAll]}
                                onPress={() => this.setTab('all')}
                            >
                                <Text
                                    style={selectedTab === 'all' ? styles.tabActiveText : styles.firstTabText}
                                >
                                    All
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.tabContainer}>
                                {['Services', 'Payment', 'Support'].map((tabName) => (
                                    <TouchableOpacity
                                        key={tabName}
                                        style={[styles.tabButton, selectedTab === tabName.toLowerCase() && styles.tabActive]}
                                        onPress={() => this.setTab(tabName.toLowerCase())}
                                    >
                                        <Text
                                            style={selectedTab === tabName.toLowerCase() ? styles.tabActiveText : styles.tabText}
                                        >
                                            {tabName}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>



                        <View style={{
                            ...styles.body,
                            height: Platform.OS == 'ios' ? "85%" : "85%"
                        }} >
                            <KeyboardAwareScrollView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                                contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_30 }}
                                style={{ flex: 1, paddingBottom: 60 }}
                                enabled
                                showsVerticalScrollIndicator={false}
                            >

                                <ScrollView
                                    ref={(ref) => (this.scrollView = ref)}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.scrollView}>
                                    {selectedTab === 'all' && this.props.contracts.length ?
                                        (
                                            <>

                                                <View style={{ ...styles.accountsLabelViewMain, marginLeft: 20 }}>
                                                    <Text style={styles.accountsLabelMain} >
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
                                        ) : null}
                                    <>
                                        {/* ========== Services Section ========== */}
                                        {(selectedTab === 'all' || selectedTab === 'services') && (
                                            <View style={styles.bodyview}>
                                                {selectedTab === 'all' && (
                                                    <View style={styles.accountsLabelView}>
                                                        <Text style={styles.accountsLabel}>Services</Text>
                                                    </View>
                                                )}
                                                <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>
                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => {
                                                            if (this.props.contracts.length) {
                                                                this.props.navigation.navigate("submitReading")
                                                            } else {
                                                                this.toastIt("No Contract Available")
                                                            }
                                                        }}
                                                    >
                                                        <View style={styles.iconContainer}>
                                                            <MeterIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"} fill={this.props.contracts.length ? "#0057A2" : "#A7A7A7"} />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 9, fontWeight: "900", opacity: this.props.contracts.length ? 1 : 0.5 }}>Meter Reading</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={this.handleRequestNewConnection}>
                                                        <View style={styles.iconContainer}>
                                                            <NewConIcon width={50} height={50} color="#FFFFFF" fill="#0057A2" />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 9, fontWeight: "900" }}>New Connection</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => {
                                                            if (this.props.contracts.length) {
                                                                this.props.navigation.navigate("disconnection")
                                                            } else {
                                                                this.toastIt("No Contract Available")
                                                            }
                                                        }}>
                                                        <View style={styles.iconContainer}>
                                                            <DisConIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"} fill={this.props.contracts.length ? "#0057A2" : "#A7A7A7"} />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 9, fontWeight: "800", opacity: this.props.contracts.length ? 1 : 0.5 }}>Disconnection</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </ScrollView>
                                            </View>
                                        )}

                                        {/* ========== Payment Section ========== */}
                                        {(selectedTab === 'all' || selectedTab === 'payment') && (
                                            <View style={styles.bodyview}>
                                                {selectedTab === 'all' && (
                                                    <View style={styles.accountsLabelView}>
                                                        <Text style={styles.accountsLabel}>Payment</Text>
                                                    </View>
                                                )}
                                                <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>
                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => {
                                                            if (this.props.contracts.length) {
                                                                this.props.navigation.navigate("Payment")
                                                            } else {
                                                                this.toastIt("No Contract Available")
                                                            }
                                                        }}>
                                                        <View style={styles.iconContainer}>
                                                            <MakePaymentIcon width={50} height={50} color="#FFFFFF" fill="#0057A2" />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 10, fontWeight: "800", opacity: this.props.contracts.length ? 1 : 0.5 }}>Make Payment</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => {
                                                            if (this.props.contracts.length) {
                                                                this.props.navigation.navigate("statement")
                                                            } else {
                                                                this.toastIt("No Contract Available")
                                                            }
                                                        }}>
                                                        <View style={styles.iconContainer}>
                                                            <StatementIcon width={50} height={50} color="#FFFFFF" fill="#0057A2" />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 10, fontWeight: "800", opacity: this.props.contracts.length ? 1 : 0.5 }}>Statement</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </ScrollView>
                                            </View>
                                        )}

                                        {/* ========== Support Section ========== */}
                                        {(selectedTab === 'all' || selectedTab === 'support') && (
                                            <View style={styles.bodyview}>
                                                {selectedTab === 'all' && (
                                                    <View style={styles.accountsLabelView}>
                                                        <Text style={styles.accountsLabel}>Support</Text>
                                                    </View>
                                                )}
                                                <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true} showsHorizontalScrollIndicator={true}>
                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => Linking.openURL(`tel:600565657`)}>
                                                        <View style={styles.iconContainer}>
                                                            <EmergencyIcon width={50} height={50} />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 10, fontWeight: "800" }}>Emergency</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => this.props.navigation.navigate("raiseComplaint")}>
                                                        <View style={styles.iconContainer}>
                                                            <CustomerCareIcon width={50} height={50} />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 10, fontWeight: "800" }}>Customer Care</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.homeOption}
                                                        onPress={() => this.props.navigation.navigate("feedback")}>
                                                        <View style={styles.iconContainer}>
                                                            <FeedBackIcon width={50} height={50} />
                                                        </View>
                                                        <View style={styles.labelContainer}>
                                                            <Text style={{ ...styles.homeoptionText, fontSize: 10, fontWeight: "800" }}>Feedback</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </ScrollView>

                                                {/* Safety Tips (not on iPad) */}
                                                {!(Platform.OS === 'ios' && Platform.isPad) && (
                                                    <ScrollView contentContainerStyle={styles.homeOptionRow} horizontal={true}>
                                                        <TouchableOpacity style={styles.homeOption} onPress={() => this.props.navigation.navigate("HelpMain")}>
                                                            <View style={styles.iconContainer}>
                                                                <SafetyTipsIcon width={50} height={50} />
                                                            </View>
                                                            <View style={styles.labelContainer}>
                                                                <Text style={{ ...styles.homeoptionText, fontSize: 10, fontWeight: "800" }}>Safety Tips</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </ScrollView>
                                                )}
                                            </View>
                                        )}


                                    </>
                                </ScrollView>
                            </KeyboardAwareScrollView>
                        </View>
                        {this.state.showToast ? (
                            <Toast message={this.state.toastMessage} isImageShow={false} />
                        ) : null}
                    </View>
                </SafeAreaView>
            </ImageBackground>
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



