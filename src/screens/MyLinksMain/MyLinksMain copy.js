import Mainstyles from '../../styles/globalStyles'
import styles from './MyLinksMainStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
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
import Modal from '../../controls/Modal'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { TermsAndConditions } from '../Login/TermsAndConditions';
import { updateUserDetails } from '../../stores/actions/user.action';
import { logout } from '../../utils/uaePassService';
import DeviceInfo from 'react-native-device-info';
import { ArrowLeftIcon } from '../../../assets/icons'

class MyLinksMain extends Component {
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
            entries: [

            ],
            showModal: false,
            readingResult: "",
            getUserDetailsCalled: false,
            existingDetails: null,
            LogoutDeviceLog: "",
            showTermsModal: false
        }
        this.scrollView = React.createRef()
    }

    async componentWillMount() {
        this.setState({
            getUserDetailsCalled: true,
            mobileNumber: await AsyncStorage.getItem("sergas_customer_mobile_number")
        }, async () => {
            this.props.getUserDetails({ "mobile": this.state.mobileNumber })
        })

    }

    componentWillReceiveProps(nextProps) {
        const { getUserDetailsResult } = nextProps;

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

    handleLogout = async () => {
        try {
            const userId = await AsyncStorage.getItem("sergas_customer_user_id");
            const deviceId = await DeviceInfo.getUniqueId();
            const deviceIp = await DeviceInfo.getIpAddress();
            const deviceName = await DeviceInfo.getDeviceName();
            const logoutDeviceLog = {
                user_id: userId,
                device_id: deviceId,
                device_ip: deviceIp,
                device_name: deviceName,
            };
            await logout(logoutDeviceLog);  
            await AsyncStorage.multiRemove([
                'sergas_customer_mobile_number', 
                'contract_list', 
                'sergas_customer_access_token', 
                'sergas_customer_login_flag',
                'sergas_customer_user_id'
            ]);
    
            
            this.props.updateContracts([]); 
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            //console.error("Error during logout process: ", error);
        }
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
                                    Settings
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                        Update your account details and access support easily
                        </Text>
                    </View>
            {/* <SafeAreaView style={{ backgroundColor: '#102D4F', height: "100%", flex: 1 }} >
                <View style={{ ...styles.headerView, height: Platform.OS == 'ios' ? Dimensions.HP_10 : Dimensions.HP_10 }}>
                    {/* <View style={{ flexDirection: "row", }}> */}
                    {/* <View style={styles.headerCol1}>
                        <Text style={styles.welcomeLabel} >
                            Settingssss
                        </Text>
                    </View> */}
                    {/* </View> */}
                    {/* <View style={styles.headerCol2}>
                    <Text style={{...styles.accountNumberText, color: "#FFFFFF"}}>Version: 2.0.44</Text>
                    </View>
                </View> */} 

                {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_80 : Dimensions.HP_88, }}> */}
                <View style={{
                    // height: Platform.OS == 'ios' ? "74%" : "74%",
                     backgroundColor: "#FFFFFF", overflow: 'hidden',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    width: '100%',
                    minHeight: Dimensions.HP_74,
                }} >
                    <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        // style={{ flex: 1, backgroundColor: "rgba(255,255,255,0)" }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_30 }}
                        style={{ flex: 1, paddingBottom: 60 }}
                        enabled
                        showsVerticalScrollIndicator={false}
                    >
                        <ScrollView
                            ref={(ref) => (this.scrollView = ref)}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollView}>

                            <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: 60, flexDirection: 'row', marginTop: 40, justifyContent: 'flex-start', backgroundColor: "#F7F9FB", borderWidth: 0, borderRadius: 4 } }}
                                onPress={() => { this.props.navigation.navigate("myAccounts") }}
                            >
                                {/* <View style={styles.optionIconViewCol11}>
                                    <View
                                        style={{...styles.icon,backgroundColor: "#ABB2AC", borderRadius: 20}}
                                        source={require('../../../assets/images/MakePaymentHome1.png')}
                                    />
                                </View> */}
                                <View style={styles.optionIconViewCol22}>
                                    {/* <Text style={styles.accountNumberText}>{t("support.emergency")}</Text> */}
                                    <View style={styles.paymentDueRow1}>
                                        {
                                            this.props.userDetails.PARTY_NAME ? <Text style={styles.notCustomerText}>{this.props.userDetails.PARTY_NAME}</Text> : this.state.existingDetails ?
                                                <Text style={styles.notCustomerText}>{this.state.existingDetails.PARTY_NAME}</Text>
                                                :
                                                <ActivityIndicator size={"small"} color={"#102D4F"} />
                                        }

                                    </View>
                                    <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5, marginBottom: 5 } }}
                                    >

                                        <Image
                                            source={require('../../../assets/images/setting.png')}
                                            style={{ ...styles.clickImage, height: 16, width: 16 }}
                                        />
                                        <Text style={styles.payBillText}>Profile Setting</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={{ ...styles.accountsLabelView }}>
                                <Text style={styles.accountsLabel} >
                                    My Account
                                </Text>
                            </View>
                            <View style={{ ...styles.cardView }}>
                                <TouchableOpacity style={{ ...{ height: 50, flexDirection: 'row', width: "90%" } }}
                                    onPress={() => { this.props.navigation.navigate("myRequests") }} >
                                    <View style={styles.optionIconViewCol1}>
                                        <Text style={styles.accountNumberText}>{t("myLinks.myRequests")}</Text>
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <Image
                                            source={require('../../../assets/images/ClickNew.png')}
                                            style={styles.clickImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: "90%", height: 0, borderTopWidth: 0.4, borderStyle: "solid", borderColor: "#ABB2AC" }} />
                                <TouchableOpacity style={{ ...{ height: 50, flexDirection: 'row', width: "90%" } }}
                                    onPress={() => { this.props.navigation.navigate("OcrTest", { fromOtp: false }) }}>
                                    <View style={styles.optionIconViewCol1}>
                                        <Text style={styles.accountNumberText}>Emirates ID</Text>
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <Image
                                            source={require('../../../assets/images/ClickNew.png')}
                                            style={styles.clickImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ ...styles.accountsLabelView, marginTop: 10 }}>
                                <Text style={styles.accountsLabel} >
                                    App Settings
                                </Text>
                            </View>
                            <View style={{ ...styles.cardView }}>
                                <TouchableOpacity style={{ ...{ height: 50, flexDirection: 'row', width: "90%" } }}
                                    onPress={() => { this.props.navigation.navigate("helpAndSupport") }} >
                                    <View style={styles.optionIconViewCol1}>
                                        <Text style={styles.accountNumberText}>Help and Support</Text>
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <Image
                                            source={require('../../../assets/images/ClickNew.png')}
                                            style={styles.clickImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: "90%", height: 0, borderTopWidth: 0.4, borderStyle: "solid", borderColor: "#ABB2AC" }} />
                                <TouchableOpacity style={{ ...{ height: 50, flexDirection: 'row', width: "90%" } }}
                                    onPress={() => { this.setState({ showTermsModal: true }) }} >
                                    <View style={styles.optionIconViewCol1}>
                                        <Text style={styles.accountNumberText}>Terms and Conditions</Text>
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <Image
                                            source={require('../../../assets/images/ClickNew.png')}
                                            style={styles.clickImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={{ ...styles.cardView, ...{ paddingHorizontal: 15, minHeight: 50, flexDirection: 'row', marginTop: 20, justifyContent: 'flex-start', backgroundColor: "#F7F9FB", borderWidth: 0, borderRadius: 4 } }}
                                // onPress={() => { Linking.openURL(`tel:600565657`) }}
                                onPress={() => {
                                    this.setState({ showModal: true })
                                }}
                            >
                                {/* <View style={styles.optionIconViewCol1}> */}
                                <Image
                                    source={require('../../../assets/images/logOut.png')}
                                    style={{ ...styles.clickImage, height: 16, width: 16 }}
                                />

                                {/* </View>
                                    <View style={styles.optionIconViewCol2}> */}
                                <Text style={styles.accountNumberText}>Logout</Text>
                                {/* </View> */}
                            </TouchableOpacity>

                            {/* {
                                this.props.contracts.length ?
                                    <>
                                        <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row', marginTop: 20 } }}
                                            onPress={() => this.props.navigation.navigate("myAccounts")}
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Image
                                                    source={require('../../../assets/images/myAccounts.png')}
                                                    style={styles.icon}
                                                />
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Text style={styles.accountNumberText}>{t("myLinks.myAccounts")}</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                            onPress={() => { this.props.navigation.navigate("statement") }}>
                                            <View style={styles.optionIconViewCol1}>
                                                <Image
                                                    source={require('../../../assets/images/bills.png')}
                                                    style={styles.icon}
                                                />
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Text style={styles.accountNumberText}>{t("myLinks.billConsumption")}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                    : null} */}

                            {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }} >
                            <View style={styles.optionIconViewCol1}>
                                <Image
                                    source={require('../../../assets/images/paymentMethods.png')}
                                    style={styles.icon}
                                />
                            </View>
                            <View style={styles.optionIconViewCol2}>
                                    <Text style={styles.accountNumberText}>{t("myLinks.paymentMethods")}</Text>
                            </View>
                        </TouchableOpacity> */}

                            {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                onPress={() => { this.props.navigation.navigate("connectionRequest") }}
                            >
                                <View style={styles.optionIconViewCol1}>
                                    <Image
                                        source={require('../../../assets/images/newRequest.png')}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.optionIconViewCol2}>
                                    <Text style={styles.accountNumberText}>{t("myLinks.requestNewConnection")}</Text>
                                </View>
                            </TouchableOpacity>

                            {
                                this.props.contracts.length ?
                                    <>
                                        <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                            onPress={() => { this.props.navigation.navigate("disconnectionRequest") }}
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Image
                                                    source={require('../../../assets/images/disconnection.png')}
                                                    style={styles.icon}
                                                />
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Text style={styles.accountNumberText}>{t("myLinks.requestDisConnection")}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                    : null}



                            <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                onPress={this.handleLogout} >
                                <View style={styles.optionIconViewCol1}>
                                    <Image
                                        source={require('../../../assets/images/myRequests.png')}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.optionIconViewCol2}>
                                    <Text style={styles.accountNumberText}>{t("myLinks.logout")}</Text>
                                </View>
                            </TouchableOpacity> */}

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
                                                source={require("../../../assets/images/readingFailure.png")}
                                            // source={this.state.readingResult == "" ? require("../../../assets/images/readingSuccess.png") : require("../../../assets/images/readingFailure.png") }
                                            />

                                            <View style={{ ...styles.inputGroupStyle, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={styles.inputLabelStyle}>{"Logout"} </Text>
                                            </View>

                                            <View style={{ ...styles.paymentDueRow1, ...{ marginBottom: 10 } }}>
                                                <Text style={{ ...styles.accountNumberText, fontSize: 12 }}>Are you sure you want to logout your account?</Text>
                                            </View>
                                            {/* <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}> */}

                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "35%", marginRight: 20, backgroundColor: "#FFFFFF", borderColor: "#FF5A5A", borderWidth: 0.4 }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        })
                                                        this.props.updateContracts([])
                                                        this.handleLogout()
                                                        // AsyncStorage.multiRemove(['sergas_customer_mobile_number', 'contract_list', 'sergas_customer_access_token','sergas_customer_login_flag'], () => {
                                                        //     this.props.navigation.navigate('Login')
                                                        // })
                                                        //logout();
                                                    }}
                                                >
                                                    <Text
                                                        style={{ ...styles.buttonLabelStyle, color: "#FF5A5A" }}>Yes</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ ...styles.buttonStyle, width: "35%", backgroundColor: "#FFFFFF" }}
                                                    onPress={() => {
                                                        this.setState({
                                                            showModal: false
                                                        })
                                                    }}
                                                >
                                                    <Text
                                                        style={{ ...styles.buttonLabelStyle, color: "#102D4F" }}>Back</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* </View> */}

                                        </View>
                                    }}
                                    titleText={{ alignItems: 'center' }}
                                /> :
                                null
                        }
                        {this.state.showTermsModal ? (
                            <Modal
                                onClose={() => this.setState({ showTermsModal: false })}
                                visible={this.state.showTermsModal}
                                onButton2={() => {
                                    this.setState({ showTermsModal: false })
                                }}
                                //   }}
                                data={{
                                    title: "Terms & conditions",
                                    message: TermsAndConditions
                                }}
                                titleText={{ alignItems: 'center' }}
                            />
                        ) : null}
                    </KeyboardAwareScrollView>
                </View>
                {/* </InfoContainer> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(MyLinksMain, {
    methods: {
        getUserDetails: {
            type: 'get',
            moduleName: 'api',
            url: 'getMobileUserDetails',
            authenticate: true,
        },
    }
}))