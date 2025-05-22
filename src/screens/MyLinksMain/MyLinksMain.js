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
// import Modal from '../../controls/Modal';
import CustomModal from '../../controls/CustomModal';
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { TermsAndConditions } from '../Login/TermsAndConditions';
import { updateUserDetails } from '../../stores/actions/user.action';
import { logout } from '../../utils/uaePassService';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { commonGradient } from '../../components/molecules/gradientStyles';

import { ArrowIcon, CheckIcon, NavIcon, IdentificationIcon, InfoSquareIcon, MoreCircleIcon, LogOutIcon } from '../../../assets/icons'
import { CommonActions } from '@react-navigation/native'

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

            this.setState({
                LogoutDeviceLog: {
                    user_id: userId,
                    device_id: deviceId,
                    device_ip: deviceIp,
                    device_name: deviceName,
                }
            }, () => {
                // Perform the logout operation
                logout(this.state.LogoutDeviceLog);
                //AsyncStorage.setItem('loginThroughUaePass',"false")
                //AsyncStorage.setItem('extuuid',"")
                // Clear AsyncStorage items
                AsyncStorage.multiRemove([
                    'sergas_customer_mobile_number',
                    'contract_list',
                    'sergas_customer_access_token',
                    'sergas_customer_login_flag',
                    'sergas_customer_user_id'
                    , 'extuuid'
                    , 'loginThroughUaePass'
                ], () => {
                    // Update the contracts and navigate to Login screen
                    this.props.updateContracts([]);
                    //this.props.navigation.navigate('Login');
                    this.props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'Walkthrough', params: { stepIndex: 4 } }, // Send them to the country selector screen
                                { name: 'Login' },
                            ],
                        })
                    );

                });
            });
        } catch (error) {
            console.error("Error during logout process: ", error);
        }
    }

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
    render() {
        return (
            <LinearGradient colors={commonGradient.colors} start={commonGradient.start} end={commonGradient.end} style={commonGradient.style} >
                <SafeAreaView style={{ height: "100%", flex: 1 }} >
                    {/* header */}
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
                    {/* <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ flexGrow: 1 }}> */}
                    <InfoContainer colors={["#FFFFFF", "#FFFFFF"]} style={{ flexGrow: 1 }}>
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

                                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("myAccounts") }} >
                                                    <Text style={styles.welcomeSubText}>Edit your profile</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.cardView}>
                                        <TouchableOpacity style={styles.rowItem} onPress={() => this.props.navigation.navigate("myRequests")} >
                                            <View style={styles.rowLeft}>
                                                <NavIcon width={30} height={30} strokeWidth="1.5" />
                                                <Text style={styles.accountNumberText}>{t("myLinks.myRequests")}</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                {/* <ArrowRightIcon /> */}
                                                <ArrowIcon direction={"right"} size={15} color="#102D4F" />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.rowItem} onPress={() => this.props.navigation.navigate("OcrTest", { fromOtp: false })} >
                                            <View style={styles.rowLeft}>
                                                <IdentificationIcon width={30} height={30} strokeWidth="1.5" />
                                                <Text style={styles.accountNumberText}>Emirates ID</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                {/* <ArrowRightIcon /> */}
                                                <ArrowIcon direction={"right"} size={15} color="#102D4F" />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.divider} />

                                    <View style={styles.cardView}>
                                        <TouchableOpacity style={styles.rowItem} onPress={() => this.props.navigation.navigate("helpAndSupport")} >
                                            <View style={styles.rowLeft}>
                                                <InfoSquareIcon width={30} height={30} strokeWidth="1.5" />
                                                <Text style={styles.accountNumberText}>Help and Support</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                {/* <ArrowRightIcon /> */}
                                                <ArrowIcon direction={"right"} size={15} color="#102D4F" />
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.rowItem} onPress={() => this.setState({ showTermsModal: true })} >
                                            <View style={styles.rowLeft}>
                                                <MoreCircleIcon width={30} height={30} strokeWidth="1.5" />
                                                <Text style={styles.accountNumberText}>Terms and Conditions</Text>
                                            </View>
                                            <View style={styles.optionIconViewCol2}>
                                                {/* <ArrowRightIcon /> */}
                                                <ArrowIcon direction={"right"} size={15} color="#102D4F" />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.divider} />
                                    {/* 🚪 Logout */}
                                    <TouchableOpacity style={styles.logoutRow} onPress={() => this.setState({ showModal: true })}>
                                        <LogOutIcon width={28} height={28} color="#F75555" />
                                        <Text style={styles.logoutText}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* 📄 Footer */}

                            </ScrollView>
                            <View>
  <Text style={styles.footerText}>
    <Text style={{ fontSize: 9, color: '#102D4F' }}>
      © 2025 Sergas Group
    </Text>
    {"\n"}
    <Text style={{ fontSize: 7, color: '#666' }}>
      version {DeviceInfo.getVersion()} (build {DeviceInfo.getBuildNumber()})
    </Text>
  </Text>
</View>



                            {/* <Text style={styles.footerText}>
                                © 2025 SERGAS Group{"\n"}Sergas Mobile App
                            </Text> */}

                            {/* {this.state.showToast ? (
                                <Toast message={this.state.toastMessage} isImageShow={false} />
                            ) : null} */}


                            {
                                this.state.showModal && (
                                    <CustomModal
                                        visible={this.state.showModal}
                                        close={false}
                                        position="bottom"
                                        onClose={() => this.setState({ showModal: false })}
                                        button1
                                        button2
                                        onButton1={() => {
                                            this.setState({ showModal: false });
                                        }}
                                        onButton2={() => {
                                            this.setState({ showModal: false });
                                            this.props.updateContracts([]);
                                            this.handleLogout();
                                        }}
                                        data={{
                                            button1: false, // we'll use custom buttons below
                                            button2: false,
                                            uri: this.state.helpImageUrl,
                                            view: (
                                                <View style={{ alignItems: 'center', width: "100%", }}>
                                                    <Text style={styles.logoutTitle}>Logout?</Text>
                                                    <Text style={styles.logoutMessage}>Are you sure to want logout?</Text>

                                                    <View style={styles.logoutButtonContainer}>
                                                        <TouchableOpacity
                                                            style={styles.cancelButton}
                                                            onPress={() => this.setState({ showModal: false })}
                                                        >
                                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={styles.logoutButton}
                                                            onPress={() => {
                                                                this.setState({ showModal: false });
                                                                this.props.updateContracts([]);
                                                                this.handleLogout();
                                                            }}
                                                        >
                                                            <Text style={styles.logoutButtonText}>Logout</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                        titleText={{ alignItems: 'center' }}
                                        logOutWarningMessage
                                    />
                                )
                            }

                            {this.state.showTermsModal ? (
                                <CustomModal
                                    visible={this.state.showTermsModal}
                                    onClose={() => this.setState({ showTermsModal: false })}
                                    button1={false}
                                    button2={false} // <--- explicitly disabling button2
                                    data={{
                                        // title: "Version 1.0",
                                        message: TermsAndConditions,
                                    }}
                                    titleText={{ marginBottom: 10 }}
                                />
                            ) : null}

                        </KeyboardAwareScrollView>

                    </InfoContainer>

                </SafeAreaView>
            </LinearGradient>

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