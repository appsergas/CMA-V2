import Mainstyles from '../../styles/globalStyles'
import styles from './SupportMainStyles'

import React, { Component } from 'react'
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Linking, ImageBackground } from 'react-native'
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
import Toast from '../../controls/Toast'
import ButtonLogoView from '../../components/molecules/ButtonLogoView';
import InfoContainer from '../../components/molecules/InfoContainer';
import { Colors } from '../../utils/Colors/Colors';
import Dimensions from '../../utils/Dimensions';
import { Images } from '../../utils/ImageSource/imageSource';
import { ArrowLeftIcon, DisConIcon, MeterIcon, NewConIcon } from '../../../assets/icons'



class SupportMain extends Component {
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
            showToast: false,
            toastMessage: ""
        }
        this.scrollView = React.createRef()
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
                                        Services
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={Mainstyles.banner}>
                        <Text style={Mainstyles.bannerText}>
                            Explore all our gas services, from new connections to meter readings and more!
                        </Text>
                    </View>
                    {/* header */}

                    <InfoContainer colors={["#F7FAFC", "#F7FAFC"]} style={{ ...Mainstyles.body, height: Platform.OS == 'ios' ? Dimensions.HP_2 : Dimensions.HP_2, }}>
                        <KeyboardAwareScrollView
                            behavior={Platform.OS === 'ios' ? 'padding' : null}

                            contentContainerStyle={{ flexGrow: 1, paddingBottom: Dimensions.HP_2 }}
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
                                                this.props.navigation.navigate("submitReading")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >
                                        <View style={{ ...Mainstyles.optionIconViewCol1, backgroundColor: this.props.contracts.length ? "#FFFFFF" : "#E6E6E6" }}>
                                            <MeterIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"} fill={this.props.contracts.length ? "#0057A2" : "#A7A7A7"} />
                                        </View>
                                        <View style={Mainstyles.optionIconViewCol2}>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.notCustomerText}>
                                                    {t("home.meterReading")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.accountNumberText}> {
                                                    t("home.updateRadingYourself")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.payBillView}>
                                                <TouchableOpacity style={Mainstyles.payBillButton}>
                                                    <Text style={[ Mainstyles.payBillText, { opacity: this.props.contracts.length ? 1 : 0.5 } ]}>
                                                        {t("home.updateNow")}
                                                    </Text>

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={Mainstyles.cardView}
                                        onPress={() => {
                                            this.props.navigation.navigate("reqNewConn")
                                        }}
                                    >
                                        <View style={{ ...Mainstyles.optionIconViewCol1, backgroundColor: this.props.contracts.length ? "#FFFFFF" : "#FFFFFF" }}>
                                            <NewConIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"} fill={this.props.contracts.length ? "#0057A2" : "#0057A2"} />
                                        </View>
                                        <View style={Mainstyles.optionIconViewCol2}>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.notCustomerText}>
                                                    {t("home.newConnection")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.accountNumberText}>
                                                    {t("home.wantConnection")}
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

                                    <TouchableOpacity style={Mainstyles.cardView}
                                        onPress={() => {
                                            if (this.props.contracts.length) {
                                                this.props.navigation.navigate("submitReading")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >
                                        <View style={{ ...Mainstyles.optionIconViewCol1, backgroundColor: this.props.contracts.length ? "#FFFFFF" : "#E6E6E6" }}>
                                            <DisConIcon width={50} height={50} color={this.props.contracts.length ? "#FFFFFF" : "#E6E6E6"} fill={this.props.contracts.length ? "#0057A2" : "#A7A7A7"} />
                                        </View>
                                        {/* <View style={Mainstyles.optionIconViewCol1}>
                                            <DisConIcon width={50} height={50} opacity={this.props.contracts.length ? 1 : 0.5} />
                                        </View> */}
                                        <View style={Mainstyles.optionIconViewCol2}>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.notCustomerText}>
                                                    {t("home.disconnection")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.paymentDueRow1}>
                                                <Text style={Mainstyles.accountNumberText}> {
                                                    t("home.wantDisconnection")}
                                                </Text>
                                            </View>
                                            <View style={Mainstyles.payBillView}>
                                                <TouchableOpacity style={Mainstyles.payBillButton}>
                                                    <Text style={[ Mainstyles.payBillText, { opacity: this.props.contracts.length ? 1 : 0.5 } ]}>
                                                        {t("home.requestNow")}
                                                    </Text>

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>



                                    {/* <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row', marginTop: 20 } }}
                                    onPress={() => {
                                        if (this.props.contracts.length) {
                                            this.props.navigation.navigate("submitReading")
                                        } else {
                                            this.toastIt("No Contract Available")
                                        }
                                    }}
                                >
                                    <View style={styles.optionIconViewCol1}>
                                        <Image
                                            style={styles.icon}
                                            source={require('../../../assets/images/SelfMeterReadingHome1.png')}
                                        />
                                    </View>
                                    <View style={styles.optionIconViewCol2}>
                                        <View style={styles.paymentDueRow1}>
                                            <Text style={styles.notCustomerText}>{t("home.meterReading")}</Text>
                                        </View>
                                        <View style={styles.paymentDueRow1}>
                                            <Text style={styles.accountNumberText}>{t("home.updateRadingYourself")} --</Text>
                                        </View>
                                        <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                        >
                                            <Text style={styles.payBillText}>{t("home.submitMeterReading")}</Text>
                                            <Image
                                                source={require('../../../assets/images/click.png')}
                                                style={styles.clickImage}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity> 


                                    <TouchableOpacity style={{ ...styles.cardView, ...{ minHeight: "auto", flexDirection: 'row' } }}
                                        onPress={() => {
                                            this.props.navigation.navigate("reqNewConn")
                                        }}
                                    >
                                        <View style={styles.optionIconViewCol1}>
                                            <Image
                                                style={styles.icon}
                                                source={require('../../../assets/images/NewConnectionHome1.png')}
                                            />
                                        </View>
                                        <View style={styles.optionIconViewCol2}>

                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.notCustomerText}>{t("home.newConnection")}</Text>
                                            </View>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.accountNumberText}>{t("home.wantConnection")}</Text>
                                            </View>
                                            <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                            >
                                                <Text style={styles.payBillText}>{t("home.requestNow")}</Text>
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
                                                this.props.navigation.navigate("disconnection")
                                            } else {
                                                this.toastIt("No Contract Available")
                                            }
                                        }}
                                    >
                                        <View style={styles.optionIconViewCol1}>
                                            <Image
                                                style={styles.icon}
                                                source={require('../../../assets/images/DisconnectionHome1.png')}
                                            />
                                        </View>
                                        <View style={styles.optionIconViewCol2}>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.notCustomerText}>{t("home.disconnection")}</Text>
                                            </View>
                                            <View style={styles.paymentDueRow1}>
                                                <Text style={styles.accountNumberText}>{t("home.wantDisconnection")}</Text>
                                            </View>
                                            <View style={{ ...styles.paymentDueRow2, ...{ marginTop: 5 } }}
                                            >
                                                <Text style={styles.payBillText}>{t("home.requestNow")}</Text>
                                                <Image
                                                    source={require('../../../assets/images/click.png')}
                                                    style={styles.clickImage}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    */}
                                </View>

                            </ScrollView>
                            {this.state.showToast ? (
                                <Toast message={this.state.toastMessage} isImageShow={false} />
                            ) : null}
                        </KeyboardAwareScrollView>
                    </InfoContainer>
                    {/* </ImageBackground> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withApiConnector(SupportMain, {
    methods: {

    }
})
)



