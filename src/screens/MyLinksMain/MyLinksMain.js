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
import { ArrowLeftIcon, CheckIcon, NavIcon } from '../../../assets/icons'

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
    truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };


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
                    <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ height: Platform.OS == 'ios' ? Dimensions.HP_1 : Dimensions.HP_1, }}>
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
                                contentContainerStyle={styles.scrollView}
                            >
                                <View style={Mainstyles.bodyview}>

                                    {/* 🧑‍🦱 Profile Header */}
                                    <View style={styles.headerView}>
                                        <View style={styles.headerLeft}>
                                            <View style={styles.profileImageContainer}>
                                                <Image
                                                    source={
                                                        this.props.userDetails.profilePicture
                                                            ? { uri: this.props.userDetails.profilePicture }
                                                            : require("../../../assets/images/logo2.png")
                                                    }
                                                    style={styles.profileImage}
                                                />
                                            </View>
                                            <View style={styles.textContainer}>
                                                <View style={styles.nameRow}>
                                                    <Text style={styles.welcomeText}>
                                                        Hi,{" "}
                                                        {this.props.userDetails.PARTY_NAME
                                                            ? this.truncateText(this.props.userDetails.PARTY_NAME, 15)
                                                            : this.props.contracts.length
                                                                ? this.truncateText(
                                                                    this.props.contracts[this.state.activeItemIndex].PARTYNAME,
                                                                    15
                                                                )
                                                                : null}
                                                    </Text>
                                                    <CheckIcon size={18} color="#4A90E2" style={styles.verifiedIcon} />
                                                </View>
                                                <Text style={styles.welcomeSubText}>Welcome Back</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* 👤 Profile Setting Button */}
                                    {/* <TouchableOpacity
                                        style={styles.cardView}
                                        onPress={() => this.props.navigation.navigate("myAccounts")}
                                    >
                                        <View style={styles.optionIconViewCol1}>
                                            {
                                                this.props.userDetails.PARTY_NAME ? (
                                                    <Text style={styles.accountNumberText}>
                                                        {this.props.userDetails.PARTY_NAME}
                                                    </Text>
                                                ) : this.state.existingDetails ? (
                                                    <Text style={styles.accountNumberText}>
                                                        {this.state.existingDetails.PARTY_NAME}
                                                    </Text>
                                                ) : (
                                                    <ActivityIndicator size={"small"} color={"#102D4F"} />
                                                )
                                            }
                                            <View style={styles.paymentDueRow2}>
                                                <Image
                                                    source={require("../../../assets/images/setting.png")}
                                                    style={{ ...styles.clickImage, height: 16, width: 16 }}
                                                />
                                                <Text style={styles.payBillText}>Profile Setting</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity> */}

                                    {/* 🔒 Section Title */}
                                    {/* <View style={styles.accountsLabelView}>
                                        <Text style={styles.accountsLabel}>My Account</Text>
                                    </View> */}

                                    {/* 🧾 My Requests / Emirates ID */}
                                    <View style={styles.cardView}>
                                        <TouchableOpacity
                                            style={styles.rowItem}
                                            onPress={() => this.props.navigation.navigate("myRequests")}
                                        >
                                            <View style={styles.rowLeft}>
                                            <NavIcon width={50} height={50} />
                                                <Text style={styles.accountNumberText}>{t("myLinks.myRequests")}</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Image
                                                    source={require("../../../assets/images/ClickNew.png")}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.rowItem}
                                            onPress={() =>
                                                this.props.navigation.navigate("OcrTest", { fromOtp: false })
                                            }
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Text style={styles.accountNumberText}>Emirates ID</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Image
                                                    source={require("../../../assets/images/ClickNew.png")}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.divider} />
                                    {/* ⚙️ App Settings Label */}
                                    {/* <View style={[styles.accountsLabelView, { marginTop: 10 }]}>
                                        <Text style={styles.accountsLabel}>App Settings</Text>
                                    </View> */}

                                    {/* 🆘 Help / Terms */}
                                    <View style={styles.cardView}>
                                        <TouchableOpacity
                                            style={styles.rowItem}
                                            onPress={() => this.props.navigation.navigate("helpAndSupport")}
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Text style={styles.accountNumberText}>Help and Support</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Image
                                                    source={require("../../../assets/images/ClickNew.png")}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.rowItem}
                                            onPress={() => this.setState({ showTermsModal: true })}
                                        >
                                            <View style={styles.optionIconViewCol1}>
                                                <Text style={styles.accountNumberText}>Terms and Conditions</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                <Image
                                                    source={require("../../../assets/images/ClickNew.png")}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.divider} />
                                    {/* 🚪 Logout */}
                                    <TouchableOpacity
                                        style={styles.logoutRow}
                                        onPress={() => this.setState({ showModal: true })}
                                    >
                                        <Image
                                            source={require("../../../assets/images/logOut.png")}
                                            style={{ ...styles.clickImage, height: 16, width: 16 }}
                                        />
                                        <Text style={styles.logoutText}>Logout</Text>
                                    </TouchableOpacity>

                                   
                                </View>
                                 {/* 📄 Footer */}
                                 
                            </ScrollView>
                            <Text style={styles.footerText}>
                                        © 2025 SERGAS Group{"\n"}Sergas Mobile App
                                    </Text>
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